import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs/operators';

import { SessionStorageService } from '../../core/services/session-storage.service';
import { AlertService } from '../../core/services/alert.service';
import { AuthenticationService } from '../../core/services/authentication.service'; // Kept if needed, though unused in original
import { CandidateService } from '../../core/services/candidate.service';
import { validateOtp } from '../../../utils/otp-utils';
import { SessionKeys } from '../../core/enums/auth-enums';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'auth-candidate-otp',
  standalone: false,
  templateUrl: './candidate-otp.component.html',
  styleUrl: './candidate-otp.component.scss'
})
export class CandidateOtpComponent implements OnInit {
  private _destroyRef = inject(DestroyRef);

  verificationKey: string | null = null;
  isAuthorized: boolean = false;
  isLoginLoading: boolean = false;

  // Config values
  otpLength: number = environment.environment.candidateAuth?.OTPLength || 5;
  headerText: string = environment.environment.candidateAuth?.OTPHeaderText || '';
  labelText: string = environment.environment.candidateAuth?.OTPSubTitle || '';

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute,
    private sessionService: SessionStorageService,
    private candidateService: CandidateService
  ) { }

  ngOnInit(): void {
    this.handleRouteParams();
  }



  private handleRouteParams(): void {
    this.route.queryParams
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(params => {
        if (params && params['Idx']) {
          this.verifyAccess(params['Idx']);
        } else {
          this.router.navigate(['/app-auth/auth/candidateunauthrorized']);
          this.isAuthorized = false;
        }
      });
  }

  isPageLoading: boolean = false;

  private verifyAccess(encryptedKey: string): void {
    this.isPageLoading = true;
    this.candidateService.getVerificationKey(encryptedKey)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this.isPageLoading = false)
      )
      .subscribe({
        next: (res: any) => {
          if (res?.Status && res?.Result) {
            this.verificationKey = res.Result;
            this.isAuthorized = true;
          } else {
            this.router.navigate(['/app-auth/auth/candidateunauthrorized']);
          }
        },
        error: (err: any) => {
          console.error('Error verifying access key:', err);
          this.router.navigate(['/app-auth/auth/candidateunauthrorized']);
        }
      });
  }

  onOtpResend(): void {
    // Implement actual resend logic here if API is available
    this.alertService.showSuccess("Otp sent again");
  }

  onOtpSubmit(otp: string): void {
    if (!this.verificationKey) {
      return;
    }

    if (!validateOtp(otp, this.alertService)) {
      return;
    }

    this.isLoginLoading = true;
    const requestPayload = `encryptedtext=${this.verificationKey}&otp=${otp}`;

    this.candidateService.candidateLogin(requestPayload)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => this.isLoginLoading = false)
      )
      .subscribe({
        next: (data: any) => {
          if (data?.Status && data?.Result) {
            this.handleLoginSuccess(data.Result);
          } else {
            this.alertService.showWarning(data?.Message);
          }
        },
        error: (err) => {
          console.error('Login error:', err);
          this.alertService.showError('An error occurred during verification.');
        }
      });
  }

  private handleLoginSuccess(result: any): void {
    this.sessionService.setSesstionStorage(SessionKeys.Token, result.Token);
    this.sessionService.setSesstionStorage(SessionKeys.LoginResponses, result);
    this.sessionService.setSesstionStorage("Encryptedtext", this.verificationKey);

    // Navigate to acceptance page
    this.router.navigate(['/app-onboarding/onboarding/candidate-acceptance']);
  }
}
