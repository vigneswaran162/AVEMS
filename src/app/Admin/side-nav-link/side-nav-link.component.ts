import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-side-nav-link',
  templateUrl: './side-nav-link.component.html',
  styleUrl: './side-nav-link.component.scss'
})
export class SideNavLinkComponent {

  constructor (private route:ActivatedRoute,private router:Router){}


  events(){
    this.router.navigate(['/EventList'], { relativeTo: this.route });

  }
  Registerationlist(id: any): void {
    // window.location.reload();  

    this.router.navigate(['/Regiseration',id], { relativeTo: this.route });
  }
}
