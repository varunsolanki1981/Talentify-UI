import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export const usernameOrEmailValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const value = control.value;
  if (!value) {
    return null;
  }

  const isEmail = Validators.email(control) === null;
  const isUserName = value.length > 0;

  if (isEmail || isUserName) {
    return null;
  }
  return { usernameOrEmail: true }; // Fails
};
