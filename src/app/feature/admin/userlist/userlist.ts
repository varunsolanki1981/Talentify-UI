import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { GridApi, ColDef, INumberFilterParams, ITextFilterParams, IDateFilterParams, RowNode, GridReadyEvent, CellValueChangedEvent, SelectionChangedEvent, FilterOpenedEvent, FilterChangedEvent, FilterModifiedEvent, IProvidedFilter, themeQuartz, Theme } from 'ag-grid-community';
import { LoginResponse, RegisterRequest } from '../../../core/models/user.interface';
import { Adminservice } from '../../../core/services/adminservice';
import { ConfirmdialogComponent } from '../../../renderers/confirmdialog-component/confirmdialog-component';
import { ActionRendererComponent } from '../../../renderers/action-renderer-component/action-renderer-component';

  const myTheme = themeQuartz.withParams({
  borderColor: "#9696C8",
  wrapperBorder: true,
  headerRowBorder: true,
  rowBorder: { style: "dotted", width: 3 },
  columnBorder: { style: "dashed" },
});

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-userlist',
  standalone: false,
  templateUrl: './userlist.html',
  styleUrl: './userlist.css',
})
export class Userlist implements AfterViewInit {

  constructor(private builder: FormBuilder, private router: Router,
    private adminService: Adminservice, private http: HttpClient, private snackBar: MatSnackBar,
    public dialog: MatDialog, private cdRef: ChangeDetectorRef) { }

  gridApi!: GridApi;

  // Row Data: The data to be displayed.
  rowData: RegisterRequest[] = [];

  theme: Theme | "legacy" = myTheme;
  // Column Definitions: Defines & controls grid columns.
  colDefs: ColDef[] = [
    {
      field: "id",
      headerName: 'Id',
      filter: "agNumberColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as INumberFilterParams,
      //floatingFilter: true
    }, {
      field: "firstName",
      headerName: 'First Name',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {
      field: "lastName",
      headerName: 'Last Name',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    },{
      field: "username",
      headerName: 'Username',
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
      field: "status",
      headerName: 'Status',
      editable: true,
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
    }, {
      field: "gender",
      headerName: 'Gender',
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
    } , {
      field: "roles",
      headerName: 'Roles',
      filter: "agTextColumnFilter",
      filterParams: {
        buttons: ["reset", "apply"],
      } as ITextFilterParams,
    }, {

      headerName: 'Action',
      cellRenderer: ActionRendererComponent,
      // cellRendererParams: {
      //   onClick: this.onDeleteRow.bind(this),
      // },
      width: 100,
      pinned: 'right',
      cellStyle: { cursor: 'pointer' },
    },
  ];

  defaultColDef: ColDef = {
    filter: true,
    editable: false,
    flex: 1,
    minWidth: 100,
  }

  ngAfterViewInit() {
    //this.message = 'all done loading :)'
    //this.cdRef.detectChanges();
  }

  ngAfterViewChecked(){
   //your code to update the model
   //this.cdRef.detectChanges();
}

  onDeleteRow(node: RowNode): void {
    const data = node.data;
    console.log('Deleting row with data:', data);
    this.gridApi.applyTransaction({ remove: [data] });
    }

  refreshParentGridData() {
    this.gridApi.refreshCells({ force: true });
  }

  refresh() {
    this.adminService.getAllUsers().subscribe({
      next: (response: RegisterRequest[]) => {
        // Handle successful response
        console.log('API Response:', response); // Log the response for debugging
        this.rowData = response;
        this.gridApi.setGridOption('rowData', response);
        this.cdRef.detectChanges();
      },
      error: (error: HttpErrorResponse) => {
        // Handle error response
        console.error('API Error:', error); // Log the error for debugging
        this.openCenteredSnackBar('Error occurred while fetching user data.', 'OK', 5000);
      },
      complete: () => {
        // Handle completion (optional)
      }
    });
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.refresh();
    this.gridApi.refreshCells({ force: true });
  }

  onCellValueChanged = (event: CellValueChangedEvent) => {
    console.log('Cell value changed:', event);
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

          this.adminService.updateUser(updatedRecord).subscribe({
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

          //console.log('Clicked Yes, new value:', newValue);
          // TODO: Call your backend API to save the change
        } else {
          console.log('Clicked No, reverting value.');
          // Revert the cell value
          //event.node.setDataValue(colDef.field!, oldValue);
          data[colDef.field!] = oldValue;
          api.refreshCells();
        }
      });
    }
  }

  // Handle row selection changed event
  onSelectionChanged = (event: SelectionChangedEvent) => {
    const selectedData = event.api.getSelectedRows();
    //console.log(`New Cell Value: ${event.api.getSelectedRows()}`);
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
