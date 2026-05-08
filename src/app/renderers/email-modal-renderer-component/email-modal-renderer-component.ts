import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { Adminservice } from '../../core/services/adminservice';
import { ContactResponse } from '../../core/models/user.interface';
import { EmailComponent } from '../../feature/admin/email-component/email-component';



@Component({
  selector: 'app-email-modal-renderer-component',
  standalone: false,
  templateUrl: './email-modal-renderer-component.html',
  styleUrl: './email-modal-renderer-component.css',
})
export class EmailModalRendererComponent implements ICellRendererAngularComp {
  
  params!: ICellRendererParams;
  rowData: ContactResponse[] = [];
  constructor(public dialog: MatDialog, private adminService: Adminservice,) {} // Inject MatDialog

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  openModal(): void {
    const dialogRef = this.dialog.open(EmailComponent, {
      width: '650px', // Set fixed width
      maxWidth: '90vw', // Or responsive width
      data: { rowData: this.params.data } // Pass data to the modal
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle modal close event if needed
    });
  }

  refreshGridData(): void {
    // Implement your logic to fetch new data, re-render the table, etc.
    // e.g., call a service method to get updated data
   this.adminService.getAllEnquiries().subscribe(data => {
      this.rowData = data;
      // If using MatTable, you might need to re-render the rows
      // this.table.renderRows(); 
    });
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }
}