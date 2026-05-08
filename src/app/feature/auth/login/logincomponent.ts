import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { usernameOrEmailValidator } from '../../../core/services/validators/username-or-email.service';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-logincomponent',
  standalone: false,
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent {

  loginForm!: FormGroup;
  errorMessage: string | null = null; //Holds the API error message
  isLoading = signal(false);
  // Boolean to toggle password visibility
  showPassword = true;

  constructor(private authService: AuthService, private router: Router, private builder: FormBuilder, private _snackBar: MatSnackBar) { }
  ngOnInit(): void {
    this.loginForm = this.builder.group({
      usernameOrEmail: ['', [Validators.required, usernameOrEmailValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null; // Reset error before the new attempt
    this.isLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/home'])
      }, // Navigate to secured area
      error: err => {
        console.error(err);
        this.isLoading.set(false);
        if (err.status === 401) {
          this.errorMessage = "Incorrect username or password.";
           this.openCenteredSnackBar('Incorrect username or password.', 'OK', 5000);
        } else if (err.status === 403) {
          this.errorMessage = "Access Denied: You don't have permission.";
           this.openCenteredSnackBar('Access Denied: You don\'t have permission.', 'OK', 5000);
        } else {
          this.errorMessage = err.error?.message || 'A server error occurred. Please try again later.';
           this.openCenteredSnackBar('A server error occurred. Please try again later.', 'OK', 5000);
        }
      }
    });
  }

  get usernameOrEmail() {
    return this.loginForm.get('usernameOrEmail');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  clear() {
    this.loginForm.reset();
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot']);
  }

  register() {
    this.router.navigate(['/auth/register']);
  }

  openCenteredSnackBar(message: string, action: string, duration: number) {
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center', // Centers horizontally
      verticalPosition: 'top', // Placeholder for vertical positioning via CSS
      panelClass: ['center-snackbar'], // Custom CSS class for vertical centering
      duration: duration, // Optional: duration in milliseconds
    };

    this._snackBar.open(message, action, config);
  }
}
