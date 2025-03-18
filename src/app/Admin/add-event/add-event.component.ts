import { Component,OnInit } from '@angular/core';
import { AddEventModel } from '../../Models/AddEventModel';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { AddEventService } from '../../Services/add-event.service';
import { MatDialog} from '@angular/material/dialog';
import { AddEventListComponent } from '../add-event-list/add-event-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.scss'
})
export class AddEventComponent implements OnInit {
  isLoading:boolean =false
model:AddEventModel;
isUpdate=false
imageSrc:any;
constructor(
  private toast:ToastNofificationService,
  private service:AddEventService,
  public dialog:MatDialog,
  private route: ActivatedRoute,
  private router:Router
){}
ngOnInit(): void {
  this.model = new AddEventModel();

  const param = this.route.snapshot.paramMap.get('id');
  if (param != "0" && param != null && param != undefined) {
    this.getById(param);
  }
}





async  getById(param:any) {
  this.isLoading = true
  let response:any = await this.service.GetById(param).catch(err=>{
    this.toast.showError(err.message,'');
  this.isLoading =false
  })
  if (response != undefined) {
   if (response.Boolval == true) {
  
       this.isUpdate = true;
       this.model = response.data[0];

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
  this.isLoading =false

   }else{
    this.toast.showError(response.returnerror,'');
    this.isLoading =false

   }
  }
}

formvalidation(){
if(this.model.EventNo == "" || this.model.EventNo ==  null || this.model.EventNo == undefined){
  this.toast.showInfo('Event No Cannot Be Blank','')
  return false
}
if(this.model.EventTitle ==  "" || this.model.EventTitle == null|| this.model.EventTitle == undefined){
  this.toast.showInfo('Event Title Cannot Be Blank','')
  return false
}
if(this.model.EventDate ==  "" || this.model.EventDate == null || this.model.EventDate == undefined){
  this.toast.showInfo('Event Date Cannot Be Blank','')
  return false
}
if(this.model.EventLastDate ==  "" || this.model.EventLastDate == null || this.model.EventLastDate == undefined){
  this.toast.showInfo('Last Registeration Date Cannot Be Blank','')  
  return false
}
if(this.model.StartTime ==  "" || this.model.StartTime == null || this.model.StartTime == undefined){
  this.toast.showInfo('Event Start Time Cannot Be Blank','')
  return false
}
if(this.model.EndTime ==  "" || this.model.EndTime == null || this.model.EndTime == undefined){
  this.toast.showInfo('Event End Time Cannot Be Blank','')
  return false
}
if(this.model.EventThumbnailImage ==  "" || this.model.EventThumbnailImage == null || this.model.EventThumbnailImage == undefined){
  this.toast.showInfo('Event Start Time Cannot Be Blank','')
  return false
}
if(this.model.EventMainImage ==  "" || this.model.EventMainImage == null || this.model.EventMainImage == undefined){
  this.toast.showInfo('Event Main Image Cannot Be Blank','')
  return false
}
if(this.model.EventSummary ==  "" || this.model.EventSummary == null || this.model.EventSummary == undefined){
  this.toast.showInfo('Event Summary Cannot Be Blank','')
  return false
}
if(this.model.EventDetails ==  "" || this.model.EventDetails == null || this.model.EventDetails == undefined){
  this.toast.showInfo('Event Details Cannot Be Blank','')
  return false
}

if(this.model.Type ==  "" || this.model.Type == null || this.model.Type == undefined){
  this.toast.showInfo('Event Status Cannot Be Blank','')
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


async onSubmit(event:any){

  if(this.formvalidation()== true){
    event.target.disabled = true;

    const editmod = this.preparemodel()
    if (this.isUpdate == true) {
      editmod.UpdatedBy = 'vignesh';
      editmod.OpsType = 'U';
    } else {
      editmod.CreatedBy = 'vignesh';
      editmod.OpsType = 'S';
    }
  await  this.CRUD(editmod)
  event.target.disabled = false;

   }
 

}



async CRUD(_model:AddEventModel) {
  this.isLoading =true

  let response:any = await this.service.CRUD(_model).catch((err) => {
    this.toast.showError(err.message,'');
    this.isLoading =false

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
     this.isLoading =false

  } else {
    this.toast.showError(response.returnerror,'');
    this.isLoading =false

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

onBack(){
  this.router.navigate(['/EventList'])
}
}
