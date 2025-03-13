import {AfterViewInit, Component, ElementRef, Input, ViewChild,Inject} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ToastNofificationService } from '../../Services/toast-nofification.service';
import { AddEventService } from '../../Services/add-event.service';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-add-event-list',
  templateUrl: './add-event-list.component.html',
  styleUrl: './add-event-list.component.scss'
})
export class AddEventListComponent {


  dataSource: any;
  _formName = 'ADD PRODUCTS LIST'
  displayedColumns = ['itemname','uom','rate','actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
  _dataListLength: any;
  @Input('focuMe') isFocused: boolean;
  @ViewChild('input') _el: ElementRef;
  dataList: any;

  constructor(private toastr:ToastNofificationService,
    private service:AddEventService,
    private router:Router,
    private route:ActivatedRoute,
    private dialogRef:MatDialogRef<AddEventListComponent>,
    @Inject(MAT_DIALOG_DATA) public data:any){
      dialogRef.disableClose = true; 
      this.LoadList()
    }


    ngAfterViewInit() {
      this._el.nativeElement.focus();
      this.LoadList()
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  
    async LoadList(){
      let response:any = await this.service.GetAll().catch(err=>{
          this.toastr.showError(err.returnerror,this._formName)
          
        })
        
        if(response !=undefined){
          if(response.Boolval == true){
            this.dataList = response.data;
            this.dataSource = new MatTableDataSource(response.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this._dataListLength = response.length;
            this.dataSource.paginator.length = response.length;
          
          }
        }
      }
  



    
    onClose(){
      this.dialogRef.close();
    }

    onEdit(id: any): void {
      console.log(id);
      this.router.navigate(['/AddEvent',id.EventNo], { relativeTo: this.route });
      this.dialogRef.close();
    }
}
