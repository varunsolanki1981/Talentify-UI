import { Component, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {

  headerTitle: string = 'Talentfy';

  constructor(private router: Router, public authService: AuthService,
    private titleService: Title
  ) {
    this.titleService.setTitle('Talentfy');
    console.log('AppComponent initialized');
  }

  protected readonly title = signal('talentfy');

  navTo(path: string) {
    console.log(`Navigating to ${path}`);
    this.router.navigateByUrl(path);
  }

    onLogout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
