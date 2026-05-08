import { ChangeDetectorRef, Component, Inject, signal } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { EmailResponse, ContactResponse } from '../../../core/models/user.interface';
import { Adminservice } from '../../../core/services/adminservice';
import { AuthService } from '../../../core/services/auth.service';
import { EmailModalRendererComponent } from '../../../renderers/email-modal-renderer-component/email-modal-renderer-component';


@Component({
  selector: 'app-email-component',
  standalone: false,
  templateUrl: './email-component.html',
  styleUrl: './email-component.css',
})
export class EmailComponent {
  emailResponse!: EmailResponse;
  emailForm!: FormGroup;
  isLoading = signal(false);
  dataForChild!: any;
  rowData: ContactResponse[] = [];

  constructor(private builder: FormBuilder, private router: Router, private auth: Adminservice,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<EmailModalRendererComponent>
  ,private _snackBar: MatSnackBar, private adminService: Adminservice, private cdRef: ChangeDetectorRef) {
    console.log(this.data); // Received data from the parent component
    this.dataForChild = this.data.rowData; // Example of using the received data
  }

  ngOnInit(): void {
    this.emailForm = this.builder.group({
      id: [{ value: this.dataForChild.id }],
      toList: [{ value: this.dataForChild.email, disabled: true }],
      subject: [{ value: 'RE: ' + this.dataForChild.subject, disabled: true }],
      body: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.isLoading.set(true);
      this.emailResponse = { ...this.emailResponse, ...this.emailForm.value }
      this.emailResponse.id = this.dataForChild.id;
      this.emailResponse.toList = this.emailForm.get('toList')?.value;
      this.emailResponse.subject = this.emailForm.get('subject')?.value;
      this.emailResponse.body = this.emailForm.get('body')?.value;
      console.log(this.emailResponse);

     this.auth.replyEmail(this.emailResponse).subscribe({
        next: (response) => {
          this.openCenteredSnackBar('Email sent successfully.', 'OK', 2000);
          this.dialogRef.close({ result: 'closed' });
          this.refreshGridData();
          //this.router.navigate(['/enquiries']);
           this.cdRef.detectChanges();
           this.isLoading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          // Handle error response
          console.error('API Error:', error); // Log the error for debugging
          this.openCenteredSnackBar('Failed to send email.', 'OK', 5000);
          this.isLoading.set(false);
        },
        complete: () => {
          // Handle completion (optional)
          this.isLoading.set(false);
        }
      });
      this.cdRef.detectChanges();
    }
  }

  refreshGridData(): void {
    // Implement your logic to fetch new data, re-render the table, etc.
    // e.g., call a service method to get updated data
     this.isLoading.set(true);
   this.adminService.getAllEnquiries().subscribe(data => {
      this.rowData = data;
      console.log(this.rowData);
      // If using MatTable, you might need to re-render the rows
      // this.table.renderRows(); 
      this.cdRef.detectChanges();
      this.isLoading.set(false);
    });
    this.cdRef.detectChanges();
  }

  onReset() {
    this.dialogRef.close({ result: 'closed' });
  }

  openCenteredSnackBar(message: string, action: string, duration: number) {
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center', // Centers horizontally
      verticalPosition: 'top', // Placeholder for vertical positioning via CSS
      panelClass: ['center-snackbar'], // Custom CSS class for vertical centering
      duration: duration, // Optional: duration in milliseconds
    };

    this._snackBar.open(message, action, config);
  }
}
