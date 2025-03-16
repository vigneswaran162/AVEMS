import {AfterViewInit, Component, ElementRef, Input, ViewChild,Inject, ChangeDetectorRef} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { AddEventService } from '../../Services/add-event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AddEventModel } from '../../Models/AddEventModel';



@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrl: './add-event-list.component.scss'
})
export class AddEventListComponent {

  isLoading:boolean =false
  dataSource: any;
  _formName = 'EVENTS LIST'
  displayedColumns = ['itemname','uom','rate','EventType','price','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  _dataListLength: any;
  @Input('focuMe') isFocused: boolean;
  @ViewChild('input') _el: ElementRef;
  dataList: any;
  model:AddEventModel;

  constructor(private toastr:ToastNofificationService,
    private service:AddEventService,
    private router:Router,
    private route:ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private toast:ToastNofificationService
 ){
        }


    ngAfterViewInit() {
      // this.model = new AddEventModel()
      this._el.nativeElement.focus();
      this.LoadList();
      this.dataSource.paginator = this.paginator;
      this.cdr.detectChanges();
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    async LoadList(){
      this.isLoading = true;
      let response:any = await this.service.GetAll().catch(err=>{
          this.toastr.showError(err.returnerror,this._formName)
          this.isLoading = false;

        })
        
        if(response !=undefined){
          if(response.Boolval == true){
            this.dataList = response.data;
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this._dataListLength = response.data.length;
            // this.dataSource.paginator.length = response.data.length;
            this.isLoading = false;

          }else{
            this.toast.showError(response.returnerror,'');
            this.isLoading =false
          }
        }
      }

    onEdit(id: any): void {
      console.log(id);
      this.router.navigate(['/AddEvent',id.EventNo], { relativeTo: this.route });
    }




    async Void(item: any) {
        item.OpsType = 'V';
        item.Void = 'Y';
        this.CRUD(item);
    }
    
    async UnVoid(item: any) {
        item.OpsType = 'V';
        item.Void = 'N';
        this.CRUD(item);
      }



      async CRUD(_model:AddEventModel) {
        let response:any = await this.service.CRUD(_model).catch((err) => {
          this.toast.showError(err.message,'');
        });
       if(response != undefined){
        if (response.Boolval == true) {     
          if (_model.Void.toLowerCase() == "y") {
            this.toast.showSuccess('Record Deleted Successfully','') 
          }
          else {
            this.toast.showSuccess('Record unvoid Successfully','') 
          }          
        } else {
          this.toast.showError(response.returnerror,'');
        }
      }
       }
    
       create(){
        this.router.navigate(['/AddEvent','0'], { relativeTo: this.route });

       }
}
