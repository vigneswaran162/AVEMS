import { Component, OnInit } from '@angular/core';
import { AddEventService } from '../../Services/add-event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterationModel } from '../../Models/RegisterationEventModel';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { RegisterationEventService } from '../../Services/registeration-event.service';
import Swal from 'sweetalert2';
import { AnyARecord } from 'node:dns';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {

 EventDetail:any;
 model:RegisterationModel;
 Title=''
 RegisterationDetail:any;
 isLoading:boolean =false

 constructor(
  private service:AddEventService,
  private Register:RegisterationEventService,
  private route: ActivatedRoute,
  private router:Router,
  private Toast:ToastNofificationService){}
 ngOnInit(): void {

  this.model = new RegisterationModel();
  const param = this.route.snapshot.paramMap.get('id');
  if (param != "0" && param != null && param != undefined) {
    this.model.EventNo = param;
    console.log(this.model.EventNo,'hello')
    this.getById(param);
  }
  
 
 }

  async  getById(param:any) {
    this.isLoading = true
    let response:any = await this.service.GetById(param).catch(err=>{
    this.Toast.showError(err.message,'')
    this.isLoading = false
    })
    if (response != undefined) {
     if (response.Boolval == true) {
         this.EventDetail = response.data[0];
         this.RegisterationDetail = response.data2;
         this.Title = response.data.EventTitle;
  
         if (
          this.EventDetail.EventMainImage != '' &&
          this.EventDetail.EventMainImage != undefined &&
          this.EventDetail.EventMainImage != null
        ) {
          
        if (this.EventDetail.EventMainImage) {
          this.EventDetail.EventMainImage = this.EventDetail.EventMainImage.replace(/^data:image\/(png|jpeg|jpg);base64,/,'');
          this.EventDetail.EventMainImage = 'data:image/png;base64,' + this.EventDetail.EventMainImage;
        }

        this.isLoading = false

      }
  
   
    }else{
      this.Toast.showError(response.returnerror,'')
      this.isLoading = false


    }
      
     }
    }


    formvalidation(){
      if(this.model.RollNo == "" || this.model.RollNo == null || this.model.RollNo == undefined){
        this.Toast.showInfo('Roll No cannot Be Blank','')
        return false
      }
      if(this.model.FullName == "" || this.model.FullName == null || this.model.FullName == undefined){
        this.Toast.showInfo('Full Name cannot Be Blank','')
        return false
      }
      if(this.model.DOB == null || this.model.DOB == undefined){
        this.Toast.showInfo('DOB cannot Be Blank','')
        return false
      }
      if(this.model.EmailAddress == "" || this.model.EmailAddress == null || this.model.EmailAddress == undefined){
        this.Toast.showInfo('Email Address cannot Be Blank','')
        return false
      }
      if(this.model.PhoneNo == "" || this.model.PhoneNo == null || this.model.PhoneNo == undefined){
        this.Toast.showInfo('Phone No cannot Be Blank','')
        return false
      }
      if(this.model.CollegeName == "" || this.model.CollegeName == null || this.model.CollegeName == undefined){
        this.Toast.showInfo('College Name cannot Be Blank','')
        return false
      }
      return true
    }

    preparemodel(){
      const mod = new RegisterationModel();
      mod.RegisterationID= '';
      mod.EventTitle = this.EventDetail.EventTitle;
      mod.RollNo = this.model.RollNo;
      mod.FullName = this.model.FullName;
      mod.EmailAddress = this.model.EmailAddress;
      mod.PhoneNo = this.model.PhoneNo;
      mod.CollegeName = this.model.CollegeName;
      mod.DOB = this.model.DOB;
      mod.Department = this.model.Department;
      mod.EventNo = this.model.EventNo;
      return mod
    }
    async onSubmit(event:any){
         if(this.formvalidation()== true){
          event.target.disabled = true;
          const editmod = this.preparemodel()
          editmod.OpsType = 'S';
         await this.CRUD(editmod)
          event.target.disabled = false;
         }
  }
       
   
     
    
   
    
    
    async CRUD(_model:RegisterationModel) {
      this.isLoading = true
      let response:any = await this.Register.CRUD(_model).catch((err) => {
        this.Toast.showError(err.message,'');
        this.isLoading = false
      });
     if(response != undefined){
      if (response.Boolval == true) {  

        Swal.fire({
          title: 'Sucessfully Registered',
          text: 'Event successfully registered. Please check your email for the ticket.',
          timer: 4000,
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          customClass: {
            icon: 'custom-icon-class' ,
            title: 'swal-custom-title', 
          }
        })
        this.model = new RegisterationModel();
        this.isLoading = false

     

      }else{
        this.Toast.showError(response.returnerror,'')
        this.isLoading = false

      }
    }
  }
    onClear(){
      this.model = new RegisterationModel();
    }



  OnBlurPhoneNo(event:any){
    if (!event.target.validity.valid){
      this.model.PhoneNo = "";
      this.Toast.showWarning('Only numeric characters allowed (minimum 10 characters)', '');

    }
    let value = event.target.value
    let phone =  this.RegisterationDetail?.filter((i:any)=> i.PhoneNo == value )
    if(phone.length>0){
      // this.Toast.showInfo('Phone Number Already Exist','')
      this.Toast.showError('This Phone Number is already registered for this event','')

      this.model.PhoneNo =""
    }
  }




  OnBlurRollNo(event:any){
    if (!event.target.validity.valid){
      this.model.RollNo = "";
      this.Toast.showWarning('Only alphanumeric characters allowed (minimum 6 characters)', '');
    }
    let value = event.target.value

    let RollNo =  this.RegisterationDetail?.filter((i:any)=> i.RollNo == value )
    if(RollNo.length>0){
      this.Toast.showError('This RollNo is already registered for this event','')
      this.model.RollNo =""
    }
  }

  OnBlurName(event:any){
    if (!event.target.validity.valid){
      this.model.FullName = "";
      this.Toast.showWarning('Only alpha characters allowed (minimum 4 characters)', '');
    }
  }

  OnBlurCollege(event:any){
    if (!event.target.validity.valid){
      this.model.CollegeName = "";
      this.Toast.showWarning('Only alpha characters allowed (minimum 4 characters)', '');
    }
  }

  onblurEmailAddress(event:any){
    if (!event.target.validity.valid){
      this.model.EmailAddress = "";
      this.Toast.showWarning('Invalid Email Address', '');

    }
    let value = event.target.value
    let EmailAddress =  this.RegisterationDetail?.filter((i:any)=> i.EmailAddress == value )
    if(EmailAddress.length>0){
      this.Toast.showError('This email address is already registered for this event','')
      this.model.EmailAddress =""
    }
  }

 GetDOB() {
   
    const Date1 = new Date('2008-01-01');
    const currentDate = new Date();
    this.model.DOB = currentDate
    const Years = currentDate.getFullYear() - Date1.getFullYear();
    
  
}


 
  }

