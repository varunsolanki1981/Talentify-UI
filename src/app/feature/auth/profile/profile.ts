import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { usernameOrEmailValidator } from '../../../core/services/validators/username-or-email.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.interface';


@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  userProfile!: User | null;
  profileForm!: FormGroup;
  errorMessage: string | null = null; //Holds the API error message
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private builder: FormBuilder, 
    private _snackBar: MatSnackBar) { 
      this.userProfile = this.authService.currentUserValue;
      
      console.log('User profile in Homecomponent:', this.userProfile?.username);
    }
  ngOnInit(): void {
    this.profileForm = this.builder.group({
      username: ['', [Validators.required, usernameOrEmailValidator]],
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });

    this.profileForm.controls['username'].setValue(this.userProfile?.username);
    this.profileForm.controls['firstName'].setValue(this.userProfile?.firstName);
    this.profileForm.controls['lastName'].setValue(this.userProfile?.lastName);
    this.profileForm.controls['email'].setValue(this.userProfile?.email);
  }

  submit() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null; // Reset error before the new attempt
    this.isLoading = true;
    this.authService.login(this.profileForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home'])
      }, // Navigate to secured area
      error: err => {
        console.error(err);
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = "Incorrect username or password.";
           this.openCenteredSnackBar('Incorrect username or password.', 'OK', 5000);
        } else if (err.status === 403) {
          this.errorMessage = "Access Denied: You don't have permission.";
           this.openCenteredSnackBar('Access Denied: You don\'t have permission.', 'OK', 5000);
        } else {
          this.errorMessage = "An unexpected error occurred.";
           this.openCenteredSnackBar('An unexpected error occurred.', 'OK', 5000);
        }
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

    this._snackBar.open(message, action, config);
  }
}
