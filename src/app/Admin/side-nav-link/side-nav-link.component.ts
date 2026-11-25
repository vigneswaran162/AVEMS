import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-side-nav-link',
  templateUrl: './side-nav-link.component.html',
  styleUrl: './side-nav-link.component.scss'
})
export class SideNavLinkComponent {

  constructor (private route:ActivatedRoute,private router:Router,private auth:AuthService){}

  Dashboard(){
    this.router.navigate(['/Dashboard'], { relativeTo: this.route });
  }

  CheckIn(){
    this.router.navigate(['/CheckIn'], { relativeTo: this.route });
  }

  logout(){
    this.auth.logout();
  }
  EventUpload(){
    this.router.navigate(['/EventUpload'], { relativeTo: this.route });
  }
  
  Announcement(){
    this.router.navigate(['/Announcement'], { relativeTo: this.route });
  }

  events(){
    this.router.navigate(['/EventList'], { relativeTo: this.route });

  }
  Registerationlist(): void {
    // window.location.reload();  

    this.router.navigate(['/Registeration'], { relativeTo: this.route });
  }
}
