import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PartnerService } from '../../../core/services/partner.service';

@Component({
  selector: 'app-becomepartner',
  standalone: false,
  templateUrl: './becomepartner.html',
  styleUrl: './becomepartner.css',
})
export class Becomepartner {

  form: FormGroup;
  loading = false;
  success = false;

  constructor(private fb: FormBuilder, private partnerService: PartnerService) {
    this.form = this.fb.group({
      organizationName: ['', Validators.required],
      contactPerson: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      category: ['', Validators.required], // Education / Health
      address: ['', Validators.required],
      description: ['']
    });
  }

  submit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.partnerService.savePartner(this.form.value)
      .subscribe({
        next: () => {
          this.success = true;
          this.loading = false;
          this.form.reset();
        },
        error: () => {
          alert('Submission failed');
          this.loading = false;
        }
      });
  }

}
