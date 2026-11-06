import { Component, ViewEncapsulation, Output, EventEmitter, Input } from '@angular/core';
import { environment } from '../../../environment/environment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { AlertService } from '../../core/services/alert.service';
import { ApiResult } from '../../core/interface/base';
import { Subscription, interval } from 'rxjs';
import { FORGOT_PASSWORD_MESSAGES } from '../../core/constants/messages.constants';

enum ForgotPasswordStep {
  USERNAME = 'username',
  OTP = 'otp',
  RESET_PASSWORD = 'reset_password'
}

// Password strength validator
function passwordStrengthValidator(control: any) {
  const password = control.value;
  if (!password) return null;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const isValid = hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  return isValid ? null : { passwordStrength: true };
}

// Must match validator
function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent {
  // from login screen 
  @Input() companyId: any;
  @Input() userType: any;
  @Input() clientCode: string = "";
  @Input() authConfigId: number = 0;
  @Output() backToLogin = new EventEmitter<void>();

  otpValue: string = '';
  currentStep: ForgotPasswordStep = ForgotPasswordStep.USERNAME;
  ForgotPasswordStep = ForgotPasswordStep;

  /** Expose message constants to the template */
  readonly MSG = FORGOT_PASSWORD_MESSAGES;

  usernameForm: FormGroup;
  resetPasswordForm: FormGroup;

  enteredUsername: string = '';
  isOtpSent: boolean = false;
  isOtpVerified: boolean = false;

  // Captcha properties
  captchaResolved: boolean = false;
  captchaResponse: string = '';

  // Google reCAPTCHA site key (test key for development)
  siteKey: string = '6Le9yNMZAAAAANfGnQm8ReAKXdX5OXupRv5q3P0j'; // Test site key
  OTPKey: any;

  // Loading states
  isGetOtpLoading: boolean = false;
  isVerifyOtpLoading: boolean = false;
  isResendOtpLoading: boolean = false;
  isResetPasswordLoading: boolean = false;

  // Properties for OTP functionality
  submitted: boolean = false;
  OTP: string | null = null;
  timecounter: number = 0;
  timeleft: number | null = null;
  configTimeLeft: number = 60;
  SpinnerShouldhide: boolean = false;
  isHiddenForgot: boolean = true;
  isHiddenOTP: boolean = true;
  isHiddenResetPassword: boolean = true;
  showVerifyButton: boolean = true;
  resultMessage: string = '';
  countdownSubscription: Subscription = new Subscription();

  ForgotpwdOTPlength: number = 6;

  constructor(
    private fb: FormBuilder,
    private authencationService: AuthenticationService,
    private alertService: AlertService
  ) {
    this.usernameForm = this.fb.group({
      username: ['', [Validators.required]],
      recaptcha: ['', [Validators.required]]
    });

    this.resetPasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.ForgotpwdOTPlength = Number(environment.environment.ForgotpwdOTPlength ?? 6);
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onBackToLogin() {
    this.backToLogin.emit();
  }

  // Captcha event handlers
  handleReset() {
    this.captchaResolved = false;
    this.captchaResponse = '';
    this.usernameForm.patchValue({ recaptcha: '' });
    console.log('Captcha reset');
  }

  handleExpire() {
    this.captchaResolved = false;
    this.captchaResponse = '';
    this.usernameForm.patchValue({ recaptcha: '' });
    console.log('Captcha expired');
  }

  handleLoad() {
    console.log('Captcha loaded');
  }

  handleSuccess(event: any) {
    this.captchaResolved = true;
    this.captchaResponse = event;
    this.usernameForm.patchValue({ recaptcha: event });
    console.log('Captcha success:', event);
  }

  onSubmitUsername() {
    if (this.usernameForm.valid && this.captchaResolved) {
      this.enteredUsername = this.usernameForm.get('username')?.value;

      this.isOtpSent = true;
      this.requestOTP();
    } else if (!this.captchaResolved) {
      console.log('Please complete the captcha');
    }
  }

  onVerifyOtp() {
    if (this.otpValue && this.otpValue.length === this.ForgotpwdOTPlength) {
      this.isOtpVerified = true;
      this.verifyOTP();
      console.log('Verifying OTP:', this.otpValue);
    }
  }

  onResendOtp() {
    this.otpValue = '';
    this.isOtpSent = true;
    this.isResendOtpLoading = true;

    // Simulate resend OTP API call
    setTimeout(() => {
      console.log('Resending OTP to username:', this.enteredUsername);
      this.startCountdown(this.configTimeLeft);
      this.isResendOtpLoading = false;
    }, 2000);
  }

  onResetPassword() {
    if (this.resetPasswordForm.valid) {
      const password = this.resetPasswordForm.get('password')?.value;
      console.log('Resetting password for username:', this.enteredUsername);
      console.log('New password:', password);

      this.alertService.showSuccess('Password reset successfully! Please login with your new password.');
      this.onBackToLogin();
    }
  }

  onBack() {
    switch (this.currentStep) {
      case ForgotPasswordStep.OTP:
        this.currentStep = ForgotPasswordStep.USERNAME;
        this.otpValue = '';
        this.isOtpSent = false;
        this.captchaResolved = false;
        this.captchaResponse = '';
        this.usernameForm.patchValue({ recaptcha: '' });
        break;
      case ForgotPasswordStep.RESET_PASSWORD:
        this.currentStep = ForgotPasswordStep.OTP;
        this.isOtpVerified = false;
        break;
    }
  }

  startCountdown(seconds: number) {
    this.timecounter = seconds;
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.timecounter--;
      if (this.timecounter <= 0) {
        this.countdownSubscription.unsubscribe();
      }
    });
  }

  requestOTP() {
    if (this.isGetOtpLoading) return;

    this.isGetOtpLoading = true;

    let requestURL_param = "companyId=" + this.companyId + "&userType=" + this.userType + "&userName=" + this.usernameForm.get('username')?.value + "&authConfigId=" + this.authConfigId + "&clientCode=" + (this.clientCode == null ? "" : this.clientCode);
    console.log('requestURL_param', requestURL_param.toString());

    this.authencationService.getUserOTP(requestURL_param.toString()).subscribe((data: any) => {
      console.log(data);
      if (data.Status) {
        const response = data.Result;
        this.OTPKey = response.OTPKey;
        this.currentStep = ForgotPasswordStep.OTP;
        this.startCountdown(this.configTimeLeft);
      } else {
        this.alertService.showWarning(data.Message);
      }
      this.isGetOtpLoading = false;
    }, (error: any) => {
      console.error('Error requesting OTP:', error);
      this.alertService.showError('Failed to send OTP. Please try again.');
      this.isGetOtpLoading = false;
    });
  }

  verifyOTP() {
    if (this.isVerifyOtpLoading) return;

    this.isVerifyOtpLoading = true;

    let requestURL_json = JSON.stringify({
      "UserId": this.OTPKey,
      "OTP": this.otpValue.toString(),
      "ACID": this.authConfigId,
      "CC": this.clientCode
    });

    this.authencationService.validateOTP(requestURL_json).subscribe((data: any) => {
      console.log(data);
      let response: ApiResult = data.Result;
      if (response) {
        this.currentStep = ForgotPasswordStep.RESET_PASSWORD;
      } else {
        this.alertService.showError(data.Message);
      }
      this.isVerifyOtpLoading = false;
    }, (error: any) => {
      console.error('Error verifying OTP:', error);
      this.alertService.showError('Failed to verify OTP. Please try again.');
      this.isVerifyOtpLoading = false;
    });
  }
}
