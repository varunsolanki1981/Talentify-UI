import { Component, Inject, NgZone } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
}

@Component({
  selector: 'app-confirmdialog-component',
  standalone: false,
  templateUrl: './confirmdialog-component.html',
  styleUrl: './confirmdialog-component.css',
})
export class ConfirmdialogComponent {
 
  constructor(
    public dialogRef: MatDialogRef<ConfirmdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData, private ngZone: NgZone
  ) { }

  onNoClick(): void {
    this.ngZone.run(() => {
    this.dialogRef.close();
  });
  }
}
