
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { AlertService } from '../../../core/services/alert.service';

enum ForgotPasswordStep {
  USERNAME = 'username',
  OTP = 'otp',
  RESET_PASSWORD = 'reset-password'
}

@Component({
  selector: 'auth-forgot-password-v2',
  standalone: false,
  templateUrl: './forgot-password-v2.component.html',
  styleUrl: './forgot-password-v2.component.scss'
})
export class ForgotPasswordV2Component implements OnInit {
  companyId: number = 0;
  userType: any;
  clientCode: string = '';
  authConfigId: number = 0;

  isGetOtpLoading = false;
  enteredUsername = '';
  otpKey: any;

  currentStep = ForgotPasswordStep.USERNAME;
  ForgotPasswordStep = ForgotPasswordStep;

  otpValue = '';
  ForgotpwdOTPlength = 6;
  isVerifyOtpLoading = false;

  newPassword = '';
  confirmPassword = '';
  isResetPasswordLoading = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.companyId = Number(params.get('companyId') || 0);
      this.userType = params.get('userType') || '';
      this.clientCode = params.get('clientCode') || '';
      this.authConfigId = Number(params.get('authConfigId') || 0);
    });
  }

  /* EXTRACT API ERROR MESSAGE */
  private getApiErrorMessage(error: any, fallback: string): string {
    return (
      error?.error?.Message ||
      error?.error?.message ||
      error?.Message ||
      error?.message ||
      (typeof error?.error === 'string' ? error.error : '') ||
      fallback
    );
  }

  /* SUBMIT USERNAME */
  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (this.isGetOtpLoading) {
      return;
    }

    if (!this.companyId || !this.authConfigId || !this.userType) {
      this.alertService.showError(
        'Authentication details are missing. Please return to Login and try again.'
      );
      return;
    }

    const usernameInput =
      form.querySelector('#username') as HTMLInputElement;

    this.enteredUsername = usernameInput.value.trim();

    if (!this.enteredUsername) {
      return;
    }

    this.requestOtp();
  }

  /* REQUEST OTP */
  requestOtp(): void {
    if (this.isGetOtpLoading) {
      return;
    }

    this.isGetOtpLoading = true;

    const requestParams =
      'companyId=' + this.companyId +
      '&userType=' + encodeURIComponent(this.userType) +
      '&userName=' + encodeURIComponent(this.enteredUsername) +
      '&authConfigId=' + this.authConfigId +
      '&clientCode=' + encodeURIComponent(this.clientCode || '');

    this.authService.getUserOTP(requestParams).subscribe({
      next: (data: any) => {
        if (data && data.Status && data.Result?.OTPKey) {
          this.otpKey = data.Result.OTPKey;

          this.currentStep = ForgotPasswordStep.OTP;
          this.otpValue = '';

          // Display the actual API success message
          if (data.Message) {
            this.alertService.showSuccess(data.Message);
          }
        } else {
          // Display the actual API failure message
          this.alertService.showWarning(
            data?.Message || 'Unable to send OTP.'
          );
        }

        this.isGetOtpLoading = false;
      },
      error: (error: any) => {
        this.alertService.showError(
          this.getApiErrorMessage(
            error,
            'Failed to send OTP. Please try again.'
          )
        );

        this.isGetOtpLoading = false;
      }
    });
  }

  /* VERIFY OTP */
  onVerifyOtp(): void {
    if (
      !this.otpValue ||
      this.otpValue.length !== this.ForgotpwdOTPlength ||
      this.isVerifyOtpLoading
    ) {
      return;
    }

    this.isVerifyOtpLoading = true;

    const requestBody = JSON.stringify({
      UserId: this.otpKey,
      OTP: this.otpValue,
      ACID: this.authConfigId,
      CC: this.clientCode
    });

    this.authService.validateOTP(requestBody).subscribe({
      next: (data: any) => {
        if (data && data.Status && data.Result) {
          // Display the actual API success message
          if (data.Message) {
            this.alertService.showSuccess(data.Message);
          }

          this.currentStep = ForgotPasswordStep.RESET_PASSWORD;
        } else {
          // Display the actual API failure message
          this.alertService.showError(
            data?.Message || 'Invalid OTP. Please try again.'
          );
        }

        this.isVerifyOtpLoading = false;
      },
      error: (error: any) => {
        this.alertService.showError(
          this.getApiErrorMessage(
            error,
            'OTP verification failed. Please try again.'
          )
        );

        this.isVerifyOtpLoading = false;
      }
    });
  }
}
