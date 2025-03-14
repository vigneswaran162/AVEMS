import { Component,OnInit } from '@angular/core';
import { AddEventModel } from '../../Models/AddEventModel';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { AddEventService } from '../../Services/add-event.service';
import { MatDialog} from '@angular/material/dialog';
import { AddEventListComponent } from '../add-event-list/add-event-list.component';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent implements OnInit {

model:AddEventModel;
isUpdate=false
imageSrc:any;
constructor(
  private toast:ToastNofificationService,
  private service:AddEventService,
  public dialog:MatDialog,
  private route: ActivatedRoute,
){}
ngOnInit(): void {
  this.model = new AddEventModel();

  const param = this.route.snapshot.paramMap.get('id');
  if (param != "0" && param != null && param != undefined) {
    this.getById(param);
  }
}





async  getById(param:any) {
  let response:any = await this.service.GetById(param).catch(err=>{
  //  this.toastr.error(err.message,this._formName)
  })
  if (response != undefined) {
   if (response.Boolval == true) {
  
       this.isUpdate = true;
       this.model = response.data;

       if (
        this.model.EventMainImage != '' &&
        this.model.EventMainImage != undefined &&
        this.model.EventMainImage != null
      ) {
        
      if (this.model.EventMainImage) {
        this.model.EventMainImage = this.model.EventMainImage.replace(/^data:image\/(png|jpeg|jpg);base64,/,'');
        this.model.EventMainImage = 'data:image/png;base64,' + this.model.EventMainImage;
      }
    }

    if (
      this.model.EventThumbnailImage != '' &&
      this.model.EventThumbnailImage != undefined &&
      this.model.EventThumbnailImage != null
    ) {
      
    if (this.model.EventThumbnailImage) {
      this.model.EventThumbnailImage = this.model.EventThumbnailImage.replace(/^data:image\/(png|jpeg|jpg);base64,/,'');
      this.model.EventThumbnailImage = 'data:image/png;base64,' + this.model.EventThumbnailImage;
    }
  }
    
   }
  }
}

formvalidation(){
if(this.model.EventNo == "" || this.model.EventNo || this.model.EventNo == undefined){
  this.toast.showError('Event No Cannot Be Blank','')
  return false
}
if(this.model.EventTitle ==  "" || this.model.EventTitle || this.model.EventTitle == undefined){
  this.toast.showError('Event Title Cannot Be Blank','')
  return false
}
if(this.model.EventDate ==  "" || this.model.EventDate || this.model.EventDate == undefined){
  this.toast.showError('Event Date Cannot Be Blank','')
  return false
}
if(this.model.EventLastDate ==  "" || this.model.EventLastDate || this.model.EventLastDate == undefined){
  this.toast.showError('Last Registeration Date Cannot Be Blank','')  
  return false
}
if(this.model.StartTime ==  "" || this.model.StartTime || this.model.StartTime == undefined){
  this.toast.showError('Event Start Time Cannot Be Blank','')
  return false
}
if(this.model.EndTime ==  "" || this.model.EndTime || this.model.EndTime == undefined){
  this.toast.showError('Event End Time Cannot Be Blank','')
  return false
}
if(this.model.EventThumbnailImage ==  "" || this.model.EventThumbnailImage || this.model.EventThumbnailImage == undefined){
  this.toast.showError('Event Start Time Cannot Be Blank','')
  return false
}
if(this.model.EventMainImage ==  "" || this.model.EventMainImage || this.model.EventMainImage == undefined){
  this.toast.showError('Event Main Image Cannot Be Blank','')
  return false
}
if(this.model.EventSummary ==  "" || this.model.EventSummary || this.model.EventSummary == undefined){
  this.toast.showError('Event Summary Cannot Be Blank','')
  return false
}
if(this.model.EventDetails ==  "" || this.model.EventDetails || this.model.EventDetails == undefined){
  this.toast.showError('Event Details Cannot Be Blank','')
  return false
}

if(this.model.Type ==  "" || this.model.Type || this.model.Type == undefined){
  this.toast.showError('Event Status Cannot Be Blank','')
  return false
}

return true

}

preparemodel(){
  const mod = new AddEventModel();
  mod.EventNo = this.model.EventNo;
  mod.EventTitle = this.model.EventTitle;
  mod.EventType = this.model.EventType;
  mod.EventDate = this.model.EventDate;
  mod.EventLastDate = this.model.EventLastDate;
  mod.StartTime = this.model.StartTime;
  mod.EndTime = this.model.EndTime;
  if (this.model.EventThumbnailImage != null && this.model.EventThumbnailImage != '') {
    mod.EventThumbnailImage = this.model.EventThumbnailImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    // mod.EventThumbnailImage = this.base64ToArrayBuffer(mod.EventThumbnailImage)
  }
  if (this.model.EventMainImage != null && this.model.EventMainImage != '') {
    mod.EventMainImage = this.model.EventMainImage.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    // mod.EventMainImage = this.base64ToArrayBuffer(mod.EventMainImage)
  }
  mod.EventSummary = this.model.EventSummary;
  mod.EventDetails = this.model.EventDetails;
  mod.EventPlace = this.model.EventPlace;
  mod.PersonAllowed = this.model.PersonAllowed;
  mod.Type = this.model.Type
  mod.Void = 'N'
  return mod
}


onSubmit(){

  // if(this.formvalidation()== true){

    const editmod = this.preparemodel()
    if (this.isUpdate == true) {
      editmod.UpdatedBy = 'vignesh';
      editmod.OpsType = 'U';
    } else {
      editmod.CreatedBy = 'vignesh';
      editmod.OpsType = 'S';
    }
    this.CRUD(editmod)
  // }
 

}



async CRUD(_model:AddEventModel) {
  let response:any = await this.service.CRUD(_model).catch((err) => {
    this.toast.showError(err.message,'');
  });
 if(response != undefined){
  if (response.Boolval == true) {     
     if(this.isUpdate){
      Swal.fire({
        title: 'Sucessfully Updated...',
        timer: 2000,
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          icon: 'custom-icon-class' 
        }
      })
     }else{
      Swal.fire({
        title: 'Sucessfully Created...',
        timer: 2000,
        icon: 'success',
        showCancelButton: false,
        showConfirmButton: false,
        customClass: {
          icon: 'custom-icon-class' 
        }
      })
     }
    
  } else {
    this.toast.showError(response.returnerror,'');
  }
}
 }


onClear(){
  this.model = new AddEventModel();
}


displayImage(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.model.EventMainImage = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
}
displayThumbnail(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.model.EventThumbnailImage = e.target?.result;
    };
    reader.readAsDataURL(file);
  }
}



base64ToArrayBuffer(base64:any) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }

  return bytes;
}


openDialog() {
  const dialogRef = this.dialog.open(AddEventListComponent, { 
    disableClose: true,
    height: '600px',
    width:'1000px'
   
  
  });
  dialogRef.afterClosed().subscribe({
    next: (val) => {  
    }
  })
 
}
}
