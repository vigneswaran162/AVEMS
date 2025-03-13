import { Component, computed, OnInit, signal } from '@angular/core';
import { AddEventService } from '../../../Services/add-event.service';
import { ToastNofificationService } from '../../../Services/toast-nofification.service';

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
  constructor (
    private toastr:ToastNofificationService,
    private service:AddEventService,
  ){}
  ngOnInit(): void {
    this.LoadList()
  }

  async LoadList(){
    let response:any = await this.service.GetAll().catch(err=>{
        this.toastr.showError(err.returnerror,this._formName)
        
      })
      
      if(response !=undefined){
        if(response.Boolval == true){
          this.dataList = response.data
        
        }
      }
    }
}
