import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { RecordCard } from '../../../core/models/user.interface';
import { RecordService } from '../../../core/services/recordservice';

@Component({
  selector: 'app-corporatecomponent',
  standalone: false,
  templateUrl: './corporatecomponent.html',
  styleUrl: './corporatecomponent.css',
})
export class Corporatecomponent {
  items: RecordCard[] = [];
   isLoading: boolean = false;

    constructor(
    private service: RecordService,
    private dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    private snackBar: MatSnackBar
  ) {}
  
  getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  ngOnInit() {
   this.loadData();
  }

   loadData() {
     this.isLoading = true;

       this.service.findByGovCategory('Corporate').subscribe({
      next: (response: RecordCard[]) => {
        // Handle successful response
        console.log('API Response:', response); // Log the response for debugging
        this.items = response;
        this.cdRef.detectChanges();
        this
      },
      error: (error: HttpErrorResponse) => {
        // Handle error response
        console.error('API Error:', error); // Log the error for debugging
        this.openCenteredSnackBar('Error occurred while fetching user data.', 'OK', 5000);
       this
      },
      complete: () => {
        // Handle completion (optional)
        this.isLoading = false;
        console.log('API call completed.'); // Log completion for debugging
      }
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
