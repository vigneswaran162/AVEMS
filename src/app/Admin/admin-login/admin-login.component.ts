import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { ToastNofificationService } from '../../Services/toast-nofification.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit {
  form: FormGroup;
  showPassword = false;
  submitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toast: ToastNofificationService
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    // Already signed in -> go straight to the admin area
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl(this.targetUrl());
    }
  }

  /** Only same-site paths are allowed as a return target. */
  private targetUrl(): string {
    const r = this.route.snapshot.queryParamMap.get('returnUrl');
    return r && r.startsWith('/') && !r.startsWith('//') && !r.startsWith('/AdminLogin') ? r : '/EventList';
  }

  isInvalid(name: string): boolean {
    const c = this.form.get(name);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  async onSubmit() {
    if (this.submitting) return;
    this.errorMessage = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    try {
      const { username, password } = this.form.value;
      await this.auth.login(username.trim(), password);
      this.toast.showSuccess('Signed in successfully', '');
      await this.router.navigateByUrl(this.targetUrl());
    } catch (err: any) {
      this.errorMessage =
        err?.error?.message ||
        (err?.status === 0 ? 'Cannot reach the server. Please try again.' : 'Sign in failed. Please try again.');
      this.form.get('password')?.reset('');
    } finally {
      this.submitting = false;
    }
  }
}
