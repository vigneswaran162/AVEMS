import { Component, OnInit } from '@angular/core';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { AddEventModel, AddFolderModel } from '../../Models/AddEventModel';
import { AddEventService } from '../../Services/add-event.service';
import * as XLSX from 'xlsx';

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

  // Event form shown when a year folder is opened
  selectedFolder: any = null;
  eventForm = { EventName: '', EventDate: '', GuestName: '' };
  participants: any[] = [];
  fileName: string = '';
  folderEvents: any[] = [];
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
 
  // ---------- Folder event form ----------
  get minDate(): string { return this.selectedFolder ? `${this.selectedFolder.YearName}-01-01` : ''; }
  get maxDate(): string { return this.selectedFolder ? `${this.selectedFolder.YearName}-12-31` : ''; }

  async openFolder(folder: any) {
    this.selectedFolder = folder;
    this.resetEventForm();
    const el = document.getElementById('eventFormModal');
    const bs = (window as any).bootstrap;
    if (el && bs) {
      bs.Modal.getOrCreateInstance(el).show();
    }
    await this.loadFolderEvents();
  }

  resetEventForm() {
    this.eventForm = { EventName: '', EventDate: '', GuestName: '' };
    this.participants = [];
    this.fileName = '';
    const fileInput = document.getElementById('participantFile') as HTMLInputElement;
    if (fileInput) { fileInput.value = ''; }
  }

  async loadFolderEvents() {
    const response: any = await this.service.GetYearEvents(this.selectedFolder.YearName).catch(err => {
      this.toast.showError(err.message, '');
    });
    if (response != undefined) {
      this.folderEvents = response.Boolval ? response.data : [];
    }
  }

  onExcelSelected(event: any) {
    const file: File = event.target.files && event.target.files[0];
    this.participants = [];
    this.fileName = '';
    if (!file) { return; }
    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      this.toast.showInfo('Please choose an Excel file (.xlsx, .xls or .csv)', '');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
        if (rows.length == 0) {
          this.toast.showInfo('The Excel file has no participant rows', '');
          event.target.value = '';
          return;
        }
        this.participants = rows;
        this.fileName = file.name;
      } catch {
        this.toast.showError('Could not read the Excel file', '');
        event.target.value = '';
      }
    };
    reader.readAsArrayBuffer(file);
  }

  eventFormValidation(): boolean {
    if (!this.eventForm.EventName.trim()) {
      this.toast.showInfo('Event Name Cannot Be Blank', '');
      return false;
    }
    if (!this.eventForm.EventDate) {
      this.toast.showInfo('Event Date Cannot Be Blank', '');
      return false;
    }
    if (this.participants.length == 0) {
      this.toast.showInfo('Please upload the participant Excel file', '');
      return false;
    }
    return true;
  }

  async SaveFolderEvent(event: any) {
    if (!this.eventFormValidation()) { return; }
    event.target.disabled = true;
    const entity = {
      YearName: this.selectedFolder.YearName,
      EventName: this.eventForm.EventName,
      EventDate: this.eventForm.EventDate,
      GuestName: this.eventForm.GuestName,
      FileName: this.fileName,
      Participants: this.participants,
    };
    const response: any = await this.service.AddYearEvent(entity).catch(err => {
      this.toast.showError(err.message, '');
    });
    event.target.disabled = false;
    if (response != undefined) {
      if (response.Boolval == true) {
        this.toast.showSuccess('Event Saved Successfully...', '');
        this.resetEventForm();
        await this.loadFolderEvents();
      } else {
        this.toast.showError(response.message, '');
      }
    }
  }

  async VoidFolderEvent(row: any) {
    const response: any = await this.service.VoidYearEvent(row._id).catch(err => {
      this.toast.showError(err.message, '');
    });
    if (response != undefined) {
      if (response.Boolval == true) {
        this.toast.showSuccess('Event Removed', '');
        await this.loadFolderEvents();
      } else {
        this.toast.showError(response.message, '');
      }
    }
  }
}
