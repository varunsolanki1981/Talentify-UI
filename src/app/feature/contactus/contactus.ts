import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ContactResponse } from '../../core/models/user.interface';


@Component({
  standalone: false,
  selector: 'app-contactus',
  templateUrl: './contactus.html',
  styleUrl: './contactus.css',

})
export class Contactus implements OnInit {
  contactResponse!: ContactResponse;
  contactForm!: FormGroup;
  successMessage = false;
  constructor(private builder: FormBuilder, private router: Router, private auth: AuthService,) { }

  ngOnInit(): void {
    this.contactForm = this.builder.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      comment: ['', Validators.required],
      subject: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {

      this.contactResponse = { ...this.contactResponse, ...this.contactForm.value }
      this.auth.contactus(this.contactResponse)
        .subscribe((res: ContactResponse) => {
          console.log('Contact form submitted successfully!', res);
        });
      this.successMessage = true;
      this.onReset();
    }
  }

  onReset() {
    this.contactForm.reset();
  }
}
