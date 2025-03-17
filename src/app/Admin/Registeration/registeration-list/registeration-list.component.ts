import { Component, computed, OnInit, signal } from '@angular/core';
import { AddEventService } from '../../../Services/add-event.service';
import { ToastNofificationService } from '../../../Services/toast-nofification.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  Type:string=''
  constructor (
    private toastr:ToastNofificationService,
    private service:AddEventService,
    private route:ActivatedRoute,
    private router:Router
  ){}
  async ngOnInit() {

    this.Type= 'upcoming'  
    await this.LoadList()
    


  }

  async LoadList(){
    this.isLoading =true
    let response:any = await this.service.GetAll().catch(err=>{
        this.toastr.showError(err.returnerror,this._formName)
        this.isLoading = false
      })
      if(response !=undefined){
        if(response.Boolval == true){
         if(response.data.length > 0){
          this.isNoData = false;   
          this.dataList = response.data.filter((i:any)=>i.Type== this.Type)
          if(this.dataList.length == 0){
            this.isNoData = true;
          }
          this.isLoading = false
         }else{
         }

        
        }
      }
    }

    OnChange(){
      this.LoadList()
    }

    NavigationList(Type:any){
      this.router.navigate(['RegisterationList',Type])
    }
}
