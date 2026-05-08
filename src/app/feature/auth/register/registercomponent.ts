import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registercomponent',
  standalone: false,
  templateUrl: './registercomponent.html',
  styleUrl: './registercomponent.css',
})
export class Registercomponent {

  registerForm!: FormGroup;
  errorMessage: string | null = null; //Holds the API error message
  isLoading: boolean = false;
  // Boolean to toggle password visibility
  showPassword = true;
  confirmPasswordB = true;

  constructor(private authService: AuthService, private builder: FormBuilder, private router: Router) { }

  public passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,16}$/
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
    this.registerForm = this.builder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // dob: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', [Validators.required, Validators.pattern(this.passwordPattern)]],
      //confirmPassword: ['', [Validators.required, this.validateSamePassword]],
      gender: ['M', Validators.required],
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
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordB = !this.confirmPasswordB;
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    this.errorMessage = null;
    this.isLoading = true;
    const registrationData = this.registerForm.value;
    console.log('Registration attempt:', registrationData);
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);
        this.router.navigate(['/thanks'])
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration failed:', err);
        // This will now display: "Username 'xyz' is already taken"
        this.errorMessage = err.error?.message || 'Registration failed. Please try again.';
      }
    })
  }

  clear() {
    this.registerForm.reset();
    this.registerForm.controls['notificationType'].setValue('M');
  }

  cancel() {
    this.router.navigate(['/home']);
  }
}