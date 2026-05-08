import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-email-icon-renderer-component',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './email-icon-renderer-component.html',
  styleUrl: './email-icon-renderer-component.css',
  // template: `
  //   <mat-icon aria-hidden="false" aria-label="Example icon">{{ iconName }}</mat-icon>
  // `,
 
})
export class EmailIconRendererComponent implements ICellRendererAngularComp {
  // public iconName: string = '';

  // agInit(params: any): void {
  //   this.iconName = params.iconName || 'default_icon';
  // }

  // refresh(params: any): boolean {
  //   // Handle refresh if necessary
  //   return false;
  // }

  isTrue: boolean = false;

  agInit(params: any): void {
    this.isTrue = !!params.value; // Coerce to boolean
  }

  refresh(params: any): boolean {
    this.isTrue = !!params.value;
    return true; // Return true to tell AG Grid you handled the refresh
  }
}