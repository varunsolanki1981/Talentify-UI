import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ICellRendererParams } from 'ag-grid-community';
import { Adminservice } from '../../core/services/adminservice';
import { ConfirmdialogComponent } from '../confirmdialog-component/confirmdialog-component';

@Component({
  selector: 'app-action-renderer-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './action-renderer-component.html',
  styleUrl: './action-renderer-component.css',
})
export class ActionRendererComponent implements ICellRendererAngularComp {
  
  constructor(private builder: FormBuilder, private router: Router,
  private adminService: Adminservice, private http: HttpClient, private snackBar: MatSnackBar,
  public dialog: MatDialog) { }
  params!: ICellRendererParams;
  isTrue: boolean = false;

  agInit(params: ICellRendererParams): void {
    this.params = params;
    
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      maxWidth: '500px',
        data: {
          title: 'Confirm Delete',
          message: `Are you sure you want to delete "${this.params.data.id}"?`
        },
      
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the modal is closed
     
       if (result === true) {
        const updatedRecord = this.params.data;
         this.adminService.deleteUser(updatedRecord).subscribe({
            next: (response) => {
              // Handle successful response
              this.openCenteredSnackBar('User deleted successfully.', 'OK', 3000);
            },
            error: (error: HttpErrorResponse) => {
              // Handle error response
              console.error('API Error:', error); // Log the error for debugging
              this.openCenteredSnackBar('Error occurred while deleting user.', 'OK', 5000);
            },
            complete: () => {
              // Handle completion (optional)
            }
          });
       } else {
         console.log('Clicked No, reverting value.');
       }
    });
  }

  onEdit(): void {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      maxWidth: '500px',
        data: {
          title: 'Confirm Edit',
          message: `Are you sure you want to edit "${this.params.data.id}"?`
        },
      
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle the result after the modal is closed
     
       if (result === true) {
        const updatedRecord = this.params.data;
         this.adminService.deleteUser(updatedRecord).subscribe({
            next: (response) => {
              // Handle successful response
              this.openCenteredSnackBar('User edited successfully.', 'OK', 3000);
            },
            error: (error: HttpErrorResponse) => {
              // Handle error response
              console.error('API Error:', error); // Log the error for debugging
              this.openCenteredSnackBar('Error occurred while editing user.', 'OK', 5000);
            },
            complete: () => {
              // Handle completion (optional)
            }
          });
       } else {
         console.log('Clicked No, reverting value.');
       }
    });
  }

  refresh(params: ICellRendererParams): boolean {
    return false; // Return false to indicate the component should be recreated
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
