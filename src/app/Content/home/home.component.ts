import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEventService } from '../../Services/add-event.service';
declare var Swiper: any;

declare var $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit  {

 
  constructor (private service:AddEventService,
    private router:Router,
    private route:ActivatedRoute){}
  EventDetails:any
 ngOnInit (){
  const swiper = new Swiper('.swiper', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  
   
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });


  const swiper1 = new Swiper('.swiper1', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
  spaceBetween: 10,
  slidesPerView: 3,

    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  
    // And if we need scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
    },
  });
   
    this.GetAll()
    
  }


  

     
  
     async GetAll(){
        let response = await this.service.GetAll().catch(err=>{
            alert(err.message)
        })
        if(response != undefined){
            this.EventDetails = response.data.filter((i:any) => i.Type == 'upcoming');
            this.EventDetails.forEach((event:any) => {
              if (event.EventThumbnailImage) {
                event.EventThumbnailImage = event.EventThumbnailImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                event.EventThumbnailImage = 'data:image/png;base64,' +   event.EventThumbnailImage;
              }
            });
         
            
        }else{
          alert(response.returnerror)
        }
      }
  
  
      EventDetail(id: any): void {
        this.router.navigate(['/EventDetail',id.EventNo], { relativeTo: this.route });
      }

  
}
