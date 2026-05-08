import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom Validator function to check if two form controls have the same value.
 */
export function matchPasswordValidator(
  controlName: string,
  matchingControlName: string
): ValidatorFn {
  // The function receives the parent control (the FormGroup, or 'Folder')
  return (group: AbstractControl): ValidationErrors | null => {
    const control = group.get(controlName); // Password field
    const matchingControl = group.get(matchingControlName); // Confirm Password field

    // Return null if either control is not found
    if (!control || !matchingControl) {
      return null;
    }

    // 💡 IMPORTANT: If we find an error, we manually set the error on the matching control.
    if (control.value !== matchingControl.value) {
      // Set the custom 'mismatch' error flag
      matchingControl.setErrors({ mismatch: true });
      return { mismatch: true };
    } else {
      // Clear the error if the values match
      matchingControl.setErrors(null);
      return null; // Null means it passed validation!
    }
  };
}
