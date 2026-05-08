import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-thankscomponent',
  standalone: false,
  templateUrl: './thankscomponent.html',
  styleUrl: './thankscomponent.css',
})
export class Thankscomponent {

  constructor(private router: Router) {}

  routToLogin() {
    this.router.navigate(['/auth/login']);
  }

}
