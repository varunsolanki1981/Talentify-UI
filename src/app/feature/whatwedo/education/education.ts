import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-education',
  standalone: false,
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  constructor(private router: Router) {}
  navToPartnership(category: string) {
    this.router.navigateByUrl(category === 'education123' ? '/becomepartner?category=education' : '/becomepartner');
  }
}
