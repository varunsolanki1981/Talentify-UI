import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { ForgotPwdResponse } from '../../../core/models/forgot-pwd-response';

@Component({
  standalone: false,
  selector: 'app-forgotcomponent',
  templateUrl: './forgotcomponent.html',
  styleUrl: './forgotcomponent.css',
})
export class Forgotcomponent {

  forgotForm!: FormGroup;
  constructor(private auth: AuthService, private builder: FormBuilder, private router: Router, private _snackBar: MatSnackBar) { }

  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/

  // Boolean to toggle password visibility
  showPassword = true;
  confirmPasswordB = true;

  ;
  forgotPwdResponse!: ForgotPwdResponse;

  arr = [
    { name: "Min 1 Uppercase Letter." },
    { name: "Min 1 Lowercase Letter." },
    { name: "Min 1 Special Character." },
    { name: "Min 1 Number." },
    { name: "Min 8 Characters." },
    { name: "Max 16 Characters." }
  ];

  tooltipText = this.arr.map((x) => ((x.name as any).padEnd(15))).join("\n");

  ngOnInit(): void {
    this.forgotForm = this.builder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      confirmPassword: ['', [Validators.required, this.validateSamePassword]],
    },
    );
  }

  checkValidations(control: { value: string }, type: any) {
    switch (type) {
      case 'special-character':
        return /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(control.value);;
      case 'number':
        return /\d/.test(control.value);
      case 'lowercase':
        return /[a-z]/.test(control.value);
      case 'uppercase':
        return /[A-Z]/.test(control.value);
      case 'length':
        return control.value.length >= 8 && control.value.length <= 16;
      default:
        return false
    }
  }

  private validateSamePassword(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');
    return password?.value == confirmPassword?.value ? null : { 'notSame': true };
  }


  // Getters for easy access to form controls in the template
  get password() { return this.forgotForm.get('password'); }
  get confirmPassword() { return this.forgotForm.get('confirmPassword'); }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordB = !this.confirmPasswordB;
  }

  forgotPassword() {

    if (this.forgotForm.valid) {
      this.forgotPwdResponse = { ...this.forgotPwdResponse, ...this.forgotForm.value }

     // this.forgotPwdResponse.email = this.auth.getUser().email;

      this.auth.forgotPwd(this.forgotPwdResponse).subscribe({
        next: (response) => {
          // Handle successful response

          //this.successMessage = 'Password reset successful! Please log in with your new password.';
          this.openCenteredSnackBar('Password reset successful! Please log in with your new password.', 'OK');
          this.router.navigate(['/login']);
        },
        error: (error: HttpErrorResponse) => {
          // Handle error response
          console.error('API Error:', error); // Log the error for debugging
          this.openCenteredSnackBar('Failed to reset password', 'X');
        },
        complete: () => {
          // Handle completion (optional)

        }
      });
    }
  }

  clear() {
    this.forgotForm.reset();
  }

  openCenteredSnackBar(message: string, action: string) {
    const config: MatSnackBarConfig = {
      horizontalPosition: 'center', // Centers horizontally
      verticalPosition: 'top', // Placeholder for vertical positioning via CSS
      panelClass: ['center-snackbar'], // Custom CSS class for vertical centering
      duration: 10000, // Optional: duration in milliseconds
    };

    this._snackBar.open(message, action, config);
  }

}
