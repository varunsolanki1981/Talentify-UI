import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DonationService } from '../../../core/services/donationservice';

@Component({
  selector: 'app-donation',
  standalone: false,
  templateUrl: './donation.html',
  styleUrl: './donation.css',
})
export class Donation {
  form: FormGroup;
  loading = false;
  success = false;
  invoiceId!: number;

  constructor(
    private fb: FormBuilder,
    private donationService: DonationService,
    ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      amount: ['', [Validators.required, Validators.min(1)]],
      panNumber : ['', Validators.required],
      address: ['', Validators.required],
      paymentMode: ['', Validators.required],
      category: ['', Validators.required],
      message: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.donationService.saveDonation(this.form.value)
      .subscribe({
        next: (res: any) => {
          console.log('Donation saved successfully', res);
          this.invoiceId = res.id; // Assuming the response contains the invoice ID
          this.success = true;
          this.loading = false;

          // download invoice
          //this.downloadInvoice(res.id);
        },
        error: () => {
          alert('Error saving donation');
          this.success = false;
          this.loading = false;
        }
      });
       this.success = true;
      this.onReset();
  }

    onReset() {
    this.form.reset();
  }

  downloadInvoice(id: number) {
    this.donationService.downloadInvoice(id)
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donation-invoice-${id}.pdf`;
        a.click();
      });
      
  }

}
