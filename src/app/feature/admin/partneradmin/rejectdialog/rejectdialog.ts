import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-rejectdialog',
  standalone: false,
  templateUrl: './rejectdialog.html',
  styleUrl: './rejectdialog.css',
})
export class Rejectdialog {
  reason = '';
  
  constructor(private dialogRef: MatDialogRef<Rejectdialog>) {}

  submit() {
    if (!this.reason) return;
    this.dialogRef.close(this.reason);
  }

    onCancel(): void {
    this.dialogRef.close(); // Closes the dialog
  }


}
