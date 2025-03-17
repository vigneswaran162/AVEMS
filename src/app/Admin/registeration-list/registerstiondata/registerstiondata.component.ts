import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddEventService } from '../../../Services/add-event.service';
import { ToastNofificationService } from '../../../Services/toast-nofification.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-registerstiondata',
  templateUrl: './registerstiondata.component.html',
  styleUrl: './registerstiondata.component.scss'
})
export class RegisterstiondataComponent implements OnInit {


  isLoading: boolean = false
  RegisterationDetail: any[] = []
  constructor(private route: ActivatedRoute,
    private service: AddEventService,
    private Toast: ToastNofificationService

  ) { }

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('id');
    if (param != "0" && param != null && param != undefined) {
      this.getById(param);
    }
  }


  async getById(param: any) {
    this.isLoading = true
    let response: any = await this.service.GetById(param).catch(err => {
      this.Toast.showError(err.message, '')
      this.isLoading = false
    })
    if (response != undefined) {
      if (response.Boolval == true) {
        this.RegisterationDetail = response.data2;

        this.isLoading = false

      }


    } else {
      this.Toast.showError(response.returnerror, '')
      this.isLoading = false


    }

  }

 

  exportToExcel(): void {

    // Convert data to a worksheet
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.RegisterationDetail);
    const workbook: XLSX.WorkBook = { Sheets: { 'Data': worksheet }, SheetNames: ['Data'] };

    // Write the workbook and convert to a buffer
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    // Create a Blob and save it
    const dataBlob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'export.xlsx');
  }
}




