import { Component, OnInit } from '@angular/core';
import { AddEventService } from '../../Services/add-event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterationModel } from '../../Models/RegisterationEventModel';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { RegisterationEventService } from '../../Services/registeration-event.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent implements OnInit {

 EventDetail:any;
 model:RegisterationModel;
 Title=''

 RegisterationDetals:any;
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
    this.getById(param);
  }
  this.GetAll()
  this.GetDOB()
  
  
 
 }

  async  getById(param:any) {
    let response:any = await this.service.GetById(param).catch(err=>{
    //  this.toastr.error(err.message,this._formName)
    })
    if (response != undefined) {
     if (response.Boolval == true) {
    
       
         this.EventDetail = response.data;
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

        this.GetRegisterationID()
      }
  
   
    }
      
     }
    }


    formvalidation(){
      if(this.model.RollNo == "" || this.model.RollNo == null || this.model.RollNo == undefined){
        this.Toast.showInfo('Roll No cannot Be Blank','')
        return false
      }
      if(this.model.FullNmae == "" || this.model.FullNmae == null || this.model.FullNmae == undefined){
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
      mod.RegisterationID= this.model.RegisterationID;
      mod.EventTitle = this.EventDetail.EventTitle;
      mod.RollNo = this.model.RollNo;
      mod.RegisterationID = this.model.RegisterationID;
      mod.EmailAddress = this.model.EmailAddress;
      mod.PhoneNo = this.model.PhoneNo;
      mod.CollegeName = this.model.CollegeName;
      mod.DOB = this.model.DOB;
      mod.Department = this.model.Department;
      return mod
    }
    onSubmit(){
         if(this.formvalidation()== true){
          const editmod = this.preparemodel()
          editmod.OpsType = 'S';
          this.CRUD(editmod)
         }
  }
       
   
     
    
   
    
    
    async CRUD(_model:RegisterationModel) {
      let response:any = await this.Register.CRUD(_model).catch((err) => {
        this.Toast.showError(err.message,'');
      });
     if(response != undefined){
      if (response.Boolval == true) {  

        Swal.fire({
          title: 'Sucessfully Registered',
          timer: 2000,
          icon: 'success',
          showCancelButton: false,
          showConfirmButton: false,
          customClass: {
            icon: 'custom-icon-class' 
          }
        })
        this.model = new RegisterationModel();
        window.location.reload();
        this.GetRegisterationID()
     

      }else{
        this.Toast.showError(response.returnerror,'')
      }
    }
  }
    onClear(){
      this.model = new RegisterationModel();
    }

    async GetRegisterationID(){
    
      let title =   this.Title

      let response:any = await this.Register.GetRegisterationID(title).catch(err=>{
        this.Toast.showError(err.message,'')
      })
      if(response != undefined){
        this.model.RegisterationID = response.data.RegisterationID
      }else{
        this.Toast.showError(response.error,'')
      }
    }

    async GetAll(){
      let response:any = await this.Register.GetRegisterationALL().catch(err=>{
        this.Toast.showError(err.message,'')
      })
      if(response != undefined){
        this.RegisterationDetals = response.data
      }
    }
  OnBlurPhoneNo(event:any){
    if (!event.target.validity.valid){
      this.model.PhoneNo = "";
    }
    let value = event.target.value
    let phone =  this.RegisterationDetals.filter((i:any)=> i.PhoneNo == value )
    if(phone.length>0){
      this.Toast.showInfo('Phone Number Already Exist','')
      this.model.PhoneNo =""
    }
  }

  onblurEmailAddress(event:any){
    if (!event.target.validity.valid){
      this.model.EmailAddress = "";
    }
    let value = event.target.value
    let EmailAddress =  this.RegisterationDetals.filter((i:any)=> i.EmailAddress == value )
    if(EmailAddress.length>0){
      this.Toast.showInfo('Email Address Already Exist','')
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

