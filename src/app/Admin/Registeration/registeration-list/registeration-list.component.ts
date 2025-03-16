import { Component, computed, OnInit, signal } from '@angular/core';
import { AddEventService } from '../../../Services/add-event.service';
import { ToastNofificationService } from '../../../Services/toast-nofification.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-registeration-list',
  templateUrl: './registeration-list.component.html',
  styleUrl: './registeration-list.component.scss'
})
export class RegisterationListComponent  implements OnInit {
  collapsed = signal(false);
  sidenavWidth = computed(() => this.collapsed() ? '60px' : '250px');
  dataList:any
  _formName=''
  isLoading:boolean=false;
  isNoData:boolean =false;
  constructor (
    private toastr:ToastNofificationService,
    private service:AddEventService,
    private route:ActivatedRoute
  ){}
  ngOnInit(): void {

    const param = this.route.snapshot.paramMap.get('id');
    if (param != "0" && param != null && param != undefined) {
      this.LoadList(param)
    }


  }

  async LoadList(param:any){
    this.isLoading =true
    let response:any = await this.service.GetAll().catch(err=>{
        this.toastr.showError(err.returnerror,this._formName)
        this.isLoading = false
      })
      if(response !=undefined){
        if(response.Boolval == true){
         if(response.data.length > 0){
          this.isNoData = false;   
          this.dataList = response.data.filter((i:any)=>i.Type== param)
          this.isLoading = false
         }else{
          this.isNoData = true;
         }

        
        }
      }
    }
}
