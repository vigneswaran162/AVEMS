import { Component, OnInit } from '@angular/core';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { AddEventModel, AddFolderModel } from '../../Models/AddEventModel';
import { AddEventService } from '../../Services/add-event.service';

@Component({
  selector: 'app-event-upload',
  templateUrl: './event-upload.component.html',
  styleUrl: './event-upload.component.scss'
})
export class EventUploadComponent implements OnInit {
  isLoading:boolean =false;

  selectedDate: string = '';
  year: string = '';
  model:AddFolderModel
  dataList: any;
  constructor (private toast:ToastNofificationService ,private service:AddEventService){}

  async ngOnInit() {
    this.model = new AddFolderModel();
    await this.LoadList()
  }



  async LoadList(){
    this.isLoading = true;
    let response:any = await this.service.GetFolder().catch(err=>{
        this.toast.showError(err.returnerror,'')
        this.isLoading = false;
      })
      if(response !=undefined){
        if(response.Boolval == true){
          this.dataList = response.data;
          this.isLoading = false;

        }else{
          this.toast.showError(response.message,'');
          this.isLoading = false;


        }}
      }

  getYear() {
    if (this.selectedDate) {
      this.year = new Date(this.selectedDate).getFullYear().toString();
    }
  }


  preparemodel(){
    const mod = new AddFolderModel();
    mod.EventNo = this.model.EventNo;
    mod.YearName = this.year;
    mod.Void = 'N'
    return mod
  }


  formvalidation(){
    if(this.selectedDate == "" || this.selectedDate ==  null || this.selectedDate == undefined){
      this.toast.showInfo('Year Cannot Be Blank','')
      return false
    }
    return true
  }


  async CREATEFOLDER(event:any) {
   
   if(this.formvalidation()== true){
    event.target.disabled = true;

    const editmod = this.preparemodel()
    let response:any = await this.service.CREATEFOLDER(editmod).catch((err) => {
      this.toast.showError(err.message,'');
      this.isLoading =false
      event.target.disabled = false;
  
    });
    if(response != undefined){
    if (response.Boolval == true) {     
      this.toast.showSuccess('Sucessfully Created Folder...','')
      await this.LoadList()
      event.target.disabled = false;


    } else {
      this.toast.showError(response.message,'');
      event.target.disabled = false;
      this.isLoading =false
  
    }
  }
   }
   }
 }
