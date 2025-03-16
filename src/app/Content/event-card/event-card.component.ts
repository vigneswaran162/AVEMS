import { Component, OnInit } from '@angular/core';
import { AddEventService } from '../../Services/add-event.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrl: './event-card.component.scss'
})
export class EventCardComponent implements OnInit {

  isLoading:boolean =false;
    constructor (private service:AddEventService,
      private router:Router,
      private route:ActivatedRoute){}
    EventDetails:any
    ngOnInit(): void {
      this.GetAll()
    }

   async GetAll(){
    this.isLoading =true
      let response = await this.service.GetAll().catch(err=>{
          alert(err.message)
          this.isLoading =false
      })
      if(response != undefined){

          this.EventDetails = response.data.filter((i:any) => i.Type == 'Current' && i.Void != 'Y');
          this.EventDetails.forEach((event:any) => {
            if (event.EventThumbnailImage) {
              event.EventThumbnailImage = event.EventThumbnailImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
              event.EventThumbnailImage = 'data:image/png;base64,' +   event.EventThumbnailImage;
            }
          });
       
          this.isLoading =false

      }else{
        this.isLoading =false

        alert(response.returnerror)
      }
    }


    EventDetail(id: any): void {
      this.router.navigate(['/EventDetail',id.EventNo], { relativeTo: this.route });
    }
}
