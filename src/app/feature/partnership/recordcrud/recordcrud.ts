import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RecordCard } from '../../../core/models/user.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RecordService } from '../../../core/services/recordservice';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridApi, GridReadyEvent } from 'ag-grid-community';
import { ConfirmDialogRecordCrud } from './ConfirmDialogRecordCrud';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-recordcrud',
  standalone: false,
  templateUrl: './recordcrud.html',
  styleUrl: './recordcrud.css',
})
export class Recordcrud implements AfterViewInit {
form!: FormGroup;
  rowData: RecordCard[] = [];
  editId!: number;
  isEdit = false;
  isLoading: boolean = false;

  gridApi!: GridApi;
  
  categories = ['Education', 'Corporate', 'Government'];

  columnDefs: ColDef[] = [
    { field: 'title', flex: 1 },
    { field: 'description', flex: 2 },
    { field: 'category', flex: 1 },
    {
      headerName: 'Actions',
      cellRenderer: (params: any) => {
        return `
        <button type="button" class="edit-btn spaced-button btn btn-sm btn-primary icon-container">Edit</button>
         
        <button type="button" class="delete-btn spaced-button btn btn-danger btn-sm icon-container">Delete</button>

        `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('edit-btn')) {
          this.onEdit(params.data);
        }
        if (params.event.target.classList.contains('delete-btn')) {
          this.onDelete(params.data.id);
        }
      },
      flex: 1
    }
  ];

  constructor(
    private fb: FormBuilder,
    private service: RecordService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
  //this.message = 'all done loading :)'
  //this.cdRef.detectChanges();
  }

  ngAfterViewChecked(){
   //your code to update the model
   //this.cdRef.detectChanges();
  }

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['Education', Validators.required]
    });

    this.loadData();
  }

    onGridReady(params: GridReadyEvent) {
      this.gridApi = params.api;
      this.loadData();
      this.gridApi.refreshCells({ force: true });
    }
    
  loadData() {
    //this.service.getAll().subscribe(res => this.records = res);
      this.isLoading = true;

       this.service.getAll().subscribe({
      next: (response: RecordCard[]) => {
        // Handle successful response
        console.log('API Response:', response); // Log the response for debugging
        this.rowData = response;
        this.gridApi.setGridOption('rowData', response);
        this.cdRef.detectChanges();
        //this
      },
      error: (error: HttpErrorResponse) => {
        // Handle error response
        console.error('API Error:', error); // Log the error for debugging
        this.openCenteredSnackBar('Error occurred while fetching user data.', 'OK', 5000);
       //this
      },
      complete: () => {
        // Handle completion (optional)
        this.isLoading = false;
        console.log('API call completed.'); // Log completion for debugging
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    if (this.isEdit) {
      this.service.update(this.editId, this.form.value).subscribe(() => {
        this.reset();
        this.loadData();
      });
    } else {
      this.service.create(this.form.value).subscribe(() => {
        this.reset();
        this.loadData();
      });
    }
  }

  onEdit(data: RecordCard) {
    this.isEdit = true;
    this.editId = data.id!;
    this.form.patchValue(data);
  }

  onDelete(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogRecordCrud);

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'true') {
        this.service.delete(id).subscribe(() => this.loadData());
      }
    });
  }

  reset() {
    this.form.reset({ category: 'Education' });
    this.isEdit = false;
  }

    openCenteredSnackBar(message: string, action: string, duration: number) {
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center', // Centers horizontally
      verticalPosition: 'top', // Placeholder for vertical positioning via CSS
      panelClass: ['center-snackbar'], // Custom CSS class for vertical centering
      duration: duration, // Optional: duration in milliseconds
    };

    this.snackBar.open(message, action, config);
  }

}
