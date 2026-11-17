
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { AlertService } from '../../../core/services/alert.service';

enum ForgotPasswordStep {
  USERNAME = 'username',
  OTP = 'otp'
}

@Component({
  selector: 'auth-forgot-password-v2',
  standalone: false,
  templateUrl: './forgot-password-v2.component.html',
  styleUrl: './forgot-password-v2.component.scss',
  
})
export class ForgotPasswordV2Component implements OnInit {

  companyId: number = 0;
  userType: any;
  clientCode: string = '';
  authConfigId: number = 0;

  isGetOtpLoading = false;
  enteredUsername = '';
  OTPKey: any;

  currentStep = ForgotPasswordStep.USERNAME;
ForgotPasswordStep = ForgotPasswordStep;

otpValue = '';
ForgotpwdOTPlength = 6;
isVerifyOtpLoading = false;
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

      console.log('Forgot Password Context:', {
        companyId: this.companyId,
        userType: this.userType,
        clientCode: this.clientCode,
        authConfigId: this.authConfigId
      });
    });
  }

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

    this.requestOTP();
  }


requestOTP(): void {
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

  this.authService.getUserOTP(requestParams).subscribe(
    (data: any) => {
      if (data && data.Status && data.Result?.OTPKey) {

        this.OTPKey = data.Result.OTPKey;

        // Move to OTP screen
        this.currentStep = ForgotPasswordStep.OTP;
        this.otpValue = '';

        this.alertService.showSuccess('OTP sent successfully.');

      } else {
        this.alertService.showWarning(
          data?.Message || 'Unable to send OTP.'
        );
      }

      this.isGetOtpLoading = false;
    },
    (error: any) => {
      console.error('Request OTP error:', error);

      this.alertService.showError(
        'Failed to send OTP. Please try again.'
      );

      this.isGetOtpLoading = false;
    }
  );
}

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
    UserId: this.OTPKey,
    OTP: this.otpValue,
    ACID: this.authConfigId,
    CC: this.clientCode
  });

  this.authService.validateOTP(requestBody).subscribe(
    (data: any) => {

      if (data && data.Status && data.Result) {
        this.alertService.showSuccess(
          'OTP verified successfully.'
        );

        console.log('OTP verification successful:', data.Result);

      } else {
        this.alertService.showError(
          data?.Message || 'Invalid OTP. Please try again.'
        );
      }

      this.isVerifyOtpLoading = false;
    },
    (error: any) => {
      console.error('OTP verification error:', error);

      this.alertService.showError(
        'OTP verification failed. Please try again.'
      );

      this.isVerifyOtpLoading = false;
    }
  );
}
}
