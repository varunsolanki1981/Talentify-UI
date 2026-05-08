import { Component } from '@angular/core';
import { DonationService } from '../../../core/services/donationservice';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-donorlist',
  standalone: false,
  templateUrl: './donorlist.html',
  styleUrl: './donorlist.css',
})
export class Donorlist {

  constructor(
    private donationService: DonationService,
    private snackBar: MatSnackBar,
  ) { }

  rowData: any[] = [];
  gridApi: any;

  columnDefs = [
    { field: 'id', sortable: true, filter: true, width: 80 },
    { field: 'name', filter: true },
    { field: 'email', filter: true },
    { field: 'amount', sortable: true },
    { field: 'category', filter: true },
    { field: 'paymentMode' },
    { field: 'transactionId' },
    {
      field: 'emailStatus', headerName: 'Email Status',
      cellStyle: (params: any) => {
        if (params.value === 'OPENED') return { color: 'green' };
        if (params.value === 'SENT') return { color: 'orange' };
        // FIX: Explicitly return null or undefined for the "else" path
        return null; 
      }
    },
    { field: 'emailSentAt', headerName: 'Sent At' },
    { field: 'emailOpenedAt', headerName: 'Opened At' },

    {
      headerName: 'Actions',
      width: 400,
      cellRenderer: (params: any) => {
        return `
        <button  type="button" class="btn-download spaced-button btn btn-sm btn-primary icon-container">Invoice</button>
        <button type="button" class="btn-resend spaced-button btn btn-sm btn-primary icon-container">Resend</button>
        <button  type="button" class="btn-delete spaced-button btn btn-danger btn-sm icon-container">Delete</button>  
        
        `;
      },
      onCellClicked: (params: any) => {
        if (params.event.target.classList.contains('btn-download')) {
          this.downloadInvoice(params.data.id);
        }
        if (params.event.target.classList.contains('btn-resend')) {
          this.resendInvoice(params.data.id);
        }
        if (params.event.target.classList.contains('btn-delete')) {
          this.deleteDonation(params.data.id);
        }
      }
    }
  ];

  //   resendInvoice(id: number) {
  //   if (!confirm('Resend invoice to donor ?')) return;

  //   this.donationService.resendInvoice(id)
  //     .subscribe({
  //       next: () => alert('Invoice sent successfully 📧'),
  //       error: () => alert('Failed to send invoice')
  //     });
  // }

  // fetch('/api/invoice')
  //   .then(response => {
  //     if (!response.ok) throw new Error('Network error');
  //     return response.text(); // Parse as text first
  //   })
  //   .then(text => {
  //     try {
  //       return JSON.parse(text); // Try parsing as JSON
  //     } catch (e) {
  //       console.error("Not JSON:", text);
  //     }
  //   });

  performTask() {
    this.someAsyncOperation()
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  someAsyncOperation(): Promise<any> {
    return new Promise((resolve, reject) => {
      // Simulate async work
      setTimeout(() => {
        const success = Math.random() > 0.5; // Random success/failure
        if (success) {
          resolve('Operation succeeded!');
        } else {
          reject(new Error('Operation failed!'));
        }
      }, 1000);
    });
  }

  resendInvoice(id: number) {
    //const newUser = { name: 'John Doe', email: 'john@example.com' };

    this.donationService.resendInvoice(id)
      .then(response => {
        this.openCenteredSnackBar('Invoice sent successfully', 'OK', 5000);
        //console.log('API Response:', response); // Log the response for debugging
        //this.rowData = response;
        //this.gridApi.setGridOption('rowData', response);
      })
      .catch((error: HttpErrorResponse) => {
        console.error('API Error:', error);
        this.openCenteredSnackBar('Failed to send invoice', 'OK', 5000);
      });
  }


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.donationService.getAllDonations()
      .subscribe((data: any) => {
        this.rowData = data;
      });
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  // 🔍 Search
  onSearch(event: any) {
    this.gridApi.setQuickFilter(event.target.value);
  }

  // 📤 Export
  exportCSV() {
    this.gridApi.exportDataAsCsv();
  }

  // 🧾 Invoice
  downloadInvoice(id: number) {
    this.donationService.downloadInvoice(id)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${id}.pdf`;
        a.click();
      });
  }

  // ❌ Delete
  deleteDonation(id: number) {
    if (!confirm('Are you sure?')) return;

    this.donationService.deleteDonation(id)
      .subscribe(() => this.loadData());
  }

  openCenteredSnackBar(message: string, action: string, duration: number) {
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center', // Centers horizontally
      verticalPosition: 'top', // Placeholder for vertical positioning via CSS
      panelClass: ['success-snackbar'], // Custom CSS class for vertical centering
      duration: duration, // Optional: duration in milliseconds
    };

    this.snackBar.open(message, action, config);
  }
}
