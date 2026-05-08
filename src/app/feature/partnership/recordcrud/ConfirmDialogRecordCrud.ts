import { Component } from '@angular/core';

@Component({
  standalone: false,
  template: `
    <h2 mat-dialog-title>Confirm</h2>
    <mat-dialog-content>Are you sure you want to delete?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button type="button" class="btn btn-danger btn-sm" style="margin-right: 8px; display: inline-flex; align-items: center; gap: 3px; " mat-dialog-close="false">No</button>
      <button type="button" class="btn btn-sm btn-primary" style="margin-right: 8px; display: inline-flex; align-items: center; gap: 3px; " mat-dialog-close="true">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDialogRecordCrud {}