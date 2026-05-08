import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GridApi, ColDef, INumberFilterParams, ITextFilterParams, IDateFilterParams, RowClassRules, GridReadyEvent, CellValueChangedEvent, SelectionChangedEvent, FilterOpenedEvent, FilterChangedEvent, FilterModifiedEvent, IProvidedFilter } from 'ag-grid-community';
import { ContactResponse } from '../../../core/models/user.interface';
import { Adminservice } from '../../../core/services/adminservice';
import { ConfirmdialogComponent } from '../../../renderers/confirmdialog-component/confirmdialog-component';
import { EmailIconRendererComponent } from '../../../renderers/email-icon-renderer-component/email-icon-renderer-component';
import { EmailModalRendererComponent } from '../../../renderers/email-modal-renderer-component/email-modal-renderer-component';

@Component({
  selector: 'app-enquiries',
  standalone: false,
  templateUrl: './enquiries.html',
  styleUrl: './enquiries.css',
})
export class Enquiries {

  constructor(private builder: FormBuilder, private router: Router,
    private adminService: Adminservice, private http: HttpClient, private snackBar: MatSnackBar,
    public dialog: MatDialog, private cdRef: ChangeDetectorRef) { 
       //this.cdRef.detectChanges();
    }

  gridApi!: GridApi;
    isLoading = signal(false);

  // Row Data: The data to be displayed.
  rowData: ContactResponse[] = [];

  ngOnInit() {
    this.cdRef.detectChanges();
  }

  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: 'Id',
      maxWidth: 80,
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as INumberFilterParams,
      //floatingFilter: true
    }, {
      field: "fullName",
      headerName: 'Full Name',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {
      field: "email",
      headerName: 'Email',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {
      field: "subject",
      headerName: 'Subject',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {
      field: "comment",
      headerName: 'Comment',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {
      field: "mobile",
      headerName: 'Contact No.',
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as INumberFilterParams,
    }, {
      field: "createdOn",
      headerName: 'Created On',
      filter: "agDateColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as IDateFilterParams,
    }, {
      field: "createdBy",
      headerName: 'Created By',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {
      field: "replied",
      headerName: 'Reply',
      cellEditor: 'agSelectCellEditor',
      cellClass: 'center-aligned-cell',
      cellEditorParams: {
        values: ['True', 'False'],
      },
      filter: "agTextColumnFilter",
      filterParams: {
        values: ['True', 'False'],
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
      cellRendererSelector: (params) => {

        if (params.data.replied === true) {
          return { component: EmailIconRendererComponent };
        } else {
          return { component: EmailModalRendererComponent };
        }
        return undefined; // Use default rendering
      }
    }
  ];
  public rowClassRules: RowClassRules = {
    // The CSS class name is the key
    'row-false-condition': (params) => {
      // Check if the specific boolean property in your row data is false
      return params.data.replied === false;
    },
  };
  defaultColDef: ColDef = {
    filter: true,
    editable: false,
    flex: 1,
    minWidth: 100,
  }

  refresh() {
    this.isLoading.set(true);  
    console.log('Refreshing grid data...');
    this.adminService.getAllEnquiries().subscribe({
      next: (response: ContactResponse[]) => {
        console.log('API Response:', response); // Log the response for debugging
        this.rowData = response;
        this.gridApi.setGridOption('rowData', response);
        this.cdRef.detectChanges();
       this.isLoading.set(false);  
      },
      error: (error: HttpErrorResponse) => {
        console.error('API Error:', error); // Log the error for debugging
        this.openCenteredSnackBar('Error occurred while fetching enquiry data.', 'OK', 5000);
        this.isLoading.set(false);
      },
      complete: () => {
        // Handle completion (optional)
        this.isLoading.set(false);

      }
    });
     this.cdRef.detectChanges();
  }


  onGridReady(params: GridReadyEvent) {
    this.isLoading.set(true);
    this.gridApi = params.api;
    this.refresh();
    this.cdRef.detectChanges();
    //this.isLoading.set(false);  
  }

  onCellValueChanged = (event: CellValueChangedEvent) => {
    const { oldValue, newValue, data, colDef, api } = event;
    if (oldValue !== newValue) {
      const dialogRef = this.dialog.open(ConfirmdialogComponent, {
        maxWidth: '500px',
        data: {
          title: 'Confirm Change',
          message: `Are you sure you want to change "${event.colDef.headerName}" from "${oldValue}" to "${newValue}"?`
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (event.oldValue === event.newValue) return;

        if (result === true) {
          // event.data contains the entire row record after the change
          const updatedRecord = event.data;
          console.log('Updated Record:', updatedRecord);

          // TODO: Call your backend API to save the change
          //console.log('Clicked Yes, new value:', newValue);
          this.adminService.updateContactUs(updatedRecord).subscribe({
            next: (response) => {
              // Handle successful response
              this.openCenteredSnackBar('User updated successfully.', 'OK', 3000);
            },
            error: (error: HttpErrorResponse) => {
              // Handle error response
              console.error('API Error:', error); // Log the error for debugging
              this.openCenteredSnackBar('Error occurred while updating user.', 'OK', 5000);
              data[colDef.field!] = oldValue;
              api.refreshCells();
            },
            complete: () => {
              // Handle completion (optional)
            }
          });
        } else {
          console.log('Clicked No, reverting value.');
          // Revert the cell value
          data[colDef.field!] = oldValue;
          api.refreshCells();
        }
      });
    }
  }

  // Handle row selection changed event
  onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedData = event.api.getSelectedRows();
    console.log(`Selected Data:\n${JSON.stringify(selectedData)}`);
  };

  rowClicked(event: any) {
    console.log(event.data);
  }

  onFilterOpened(e: FilterOpenedEvent) {
    console.log("onFilterOpened", e);
  }

  onFilterChanged(e: FilterChangedEvent) {
    console.log("onFilterChanged", e);
    console.log("this.gridApi.getFilterModel() =>", e.api.getFilterModel());
  }

  onFilterModified(e: FilterModifiedEvent) {
    console.log("onFilterModified", e);
    console.log("applied model =>", e.api.getColumnFilterModel(e.column));
    console.log(
      "unapplied model =>",
      (e.filterInstance as unknown as IProvidedFilter).getModelFromUi(),
    );
  }

  onQuickFilterChanged() {
    this.gridApi.setGridOption(
      "quickFilterText",
      document.querySelector<HTMLInputElement>("#quickFilter")?.value,
    );
  }

  updateSelectAllMode() {
    const selectAll =
      document.querySelector<HTMLSelectElement>("#select-all-mode")?.value ??
      "all";
    this.gridApi.setGridOption("rowSelection", {
      mode: "multiRow",
      selectAll: selectAll as "all" | "filtered" | "currentPage",
    });
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
