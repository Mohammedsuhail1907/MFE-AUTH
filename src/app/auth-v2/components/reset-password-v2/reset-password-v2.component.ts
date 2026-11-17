
import { Component } from '@angular/core';

@Component({
  selector: 'auth-reset-password-v2',
  standalone: false,
  templateUrl: './reset-password-v2.component.html',
  styleUrls: ['./reset-password-v2.component.scss']
})
export class ResetPasswordV2Component {

  newPassword = '';
  confirmPassword = '';

  showNewPassword = false;
  showConfirmPassword = false;

  submitError = '';

  get hasUppercase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  get hasLowercase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  get hasNumber(): boolean {
    return /[0-9]/.test(this.newPassword);
  }

  get hasSpecialCharacter(): boolean {
    return /[^A-Za-z0-9]/.test(this.newPassword);
  }

  get isPasswordValid(): boolean {
    return (
      this.hasUppercase &&
      this.hasLowercase &&
      this.hasNumber &&
      this.hasSpecialCharacter
    );
  }

  get passwordMismatch(): boolean {
    return (
      this.confirmPassword.length > 0 &&
      this.newPassword !== this.confirmPassword
    );
  }

  onNewPasswordInput(event: Event): void {
    this.newPassword = (event.target as HTMLInputElement).value;
    this.submitError = '';
  }

  onConfirmPasswordInput(event: Event): void {
    this.confirmPassword = (event.target as HTMLInputElement).value;
    this.submitError = '';
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.isPasswordValid) {
      this.submitError = 'Please meet all password requirements.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.submitError = 'Passwords do not match.';
      return;
    }

  }

}
