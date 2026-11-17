
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { navigateToUrl } from 'single-spa';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { environment } from '../../../../environment/environment';

import { AuthenticationService } from '../../../core/services/authentication.service';
import { AlertService } from '../../../core/services/alert.service';
import { SessionStorageService } from '../../../core/services/session-storage.service';

import { ApiResult } from '../../../core/interface/base';
import {
  AuthenticationConfiguration,
  LoginModel,
  LoginResponses,
  NetworkDetails,
  GeoLocation,
  DeviceDetails
} from '../../../core/interface/auth.interface';

import {
  _DeviceDetails,
  _NetworkDetails,
  _BrowserDetails,
  _GeoLocation
} from '../../../core/constants/login.constants';

import {
  getBrowserDetails,
  getDeviceDetails,
  getNetworkDetails,
  getGeoLocation
} from '../../../core/utils/client-context.util';

import { SessionKeys } from '../../../core/enums/auth-enums';

import {
  SERVER_ERRORS,
  VALIDATION_MESSAGES,
  UI_LABELS
} from '../../../core/constants/messages.constants';

@Component({
  selector: 'auth-login-v2',
  standalone: false,
  templateUrl: './login-v2.component.html',
  styleUrls: ['./login-v2.component.scss']
})
export class LoginV2Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loginForm!: FormGroup;
  loginModel: LoginModel = {} as LoginModel;
  loginResponse!: LoginResponses;
  _authenticationConfiguration!: AuthenticationConfiguration;

  clientCode = '';
  authKey = '';
  logoSrc = '/assets/images/hfactor-logo.png';

  googlePlayUrl = '';
  appStoreUrl = '';

  isLoginLoading = false;
  isInitialLoading = false;
  isEnableTFAForWeb = false;

  serverError: string | null = null;

  readonly SERVER_ERRORS = SERVER_ERRORS;
  readonly VALIDATION_MESSAGES = VALIDATION_MESSAGES;
  readonly UI_LABELS = UI_LABELS;

  get isSsoEnabled(): boolean {
    return Number(this._authenticationConfiguration?.AuthType) === 2;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private sessionService: SessionStorageService
  ) {}

  ngOnInit(): void {
    this.googlePlayUrl = environment.environment?.GooglePlayUrl || '';
    this.appStoreUrl = environment.environment?.AppStoreUrl || '';

    this.createLoginForm();

    this.route.paramMap
      .pipe(
        map(params => params.get('clientCode')),
        takeUntil(this.destroy$)
      )
      .subscribe((clientCode: string | null) => {
        this.clientCode = clientCode
          ? clientCode
          : (environment.environment.urlCode || '');

        this.updateLogoSrc();

        this.serverError = null;
        this.isInitialLoading = true;

        this.initialApiRequest().subscribe({
          next: () => {
            this.isInitialLoading = false;
          },
          error: (error) => {
            this.isInitialLoading = false;

            const status = error && error.status;

            if (status >= 500) {
              this.serverError = SERVER_ERRORS.SERVICE_UNAVAILABLE;
            } else if (status === 401 || status === 403) {
              this.serverError = SERVER_ERRORS.ACCESS_DENIED;
            } else {
              this.serverError = SERVER_ERRORS.CONNECTION_FAILED;
            }
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateLogoSrc(): void {
    const code = this.clientCode || environment.environment.urlCode || '';

    this.logoSrc = code
      ? `/images/${code}-logo.png`
      : '/assets/images/hfactor-logo.png';
  }

  onLogoError(): void {
    this.logoSrc = '/assets/images/hfactor-logo.png';
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  initialApiRequest() {
    const requestParams =
      `urlCode=${environment.environment.urlCode}&authKey=${this.authKey}`;

    return this.authService
      .getAuthenticationConfiguration(requestParams)
      .pipe(
        takeUntil(this.destroy$),
        map((data: any) => {
          const response = JSON.parse(data.Result);

          this._authenticationConfiguration = response;

          return response;
        })
      );
  }

  login(): void {
    if (this.isLoginLoading) {
      return;
    }

    if (this.loginForm.invalid) {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);

        if (control) {
          control.markAsTouched();
        }
      });

      return;
    }

    this.isLoginLoading = true;
    this.serverError = null;

    sessionStorage.clear();

    if (!this._authenticationConfiguration) {
      this.initialApiRequest().subscribe({
        next: () => {
          this.performLogin();
        },
        error: () => {
          this.isLoginLoading = false;
        }
      });

      return;
    }

    this.performLogin();
  }

  performLogin(): void {
    this.loginModel.AuthConfiguration =
      this._authenticationConfiguration;

    this.loginModel.CompanyId =
      this._authenticationConfiguration.CompanyId;

    this.loginModel.UserType =
      this._authenticationConfiguration.UserType;

    this.loginModel.ClientId =
      this._authenticationConfiguration.ClientId;

    this.loginModel.AuthType =
      this._authenticationConfiguration.AuthType;

    const usernameControl = this.loginForm.get('username');
    const passwordControl = this.loginForm.get('password');

    this.loginModel.UserName = usernameControl
      ? usernameControl.value
      : null;

    this.loginModel.Password = passwordControl
      ? passwordControl.value
      : null;

    this.loginModel.ClientCode = this.clientCode;
    this.loginModel.IMEI = '';

    const browser = getBrowserDetails();

    this.loginModel.Browser = browser || _BrowserDetails;

    Promise.all([
      getDeviceDetails().catch(() => _DeviceDetails),
      getGeoLocation().catch(() => _GeoLocation),
      getNetworkDetails().catch(() => _NetworkDetails)
    ])
      .then(([device, location, network]) => {
        this.loginModel.Device = device as DeviceDetails;
        this.loginModel.Location = location as GeoLocation;
        this.loginModel.Network = network as NetworkDetails;

        const credential = JSON.stringify(this.loginModel);

        this.authService
          .login(credential)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (data: ApiResult) => {
              if (data.Result && data.Status) {
                this.loginResponse = data.Result;

                try {
                  this.handleSession(this.loginResponse);
                } catch (exception) {
                  console.log('Exception Error: ', exception);
                }
              } else {
                this.serverError = data.Message;
              }

              this.isLoginLoading = false;
            },
            error: (err) => {
              console.log('Something is wrong! :', err);

              this.isLoginLoading = false;

              if (err && err.status >= 500) {
                this.serverError = SERVER_ERRORS.SERVER_ERROR;
              }
            }
          });
      })
      .catch(() => {
        this.isLoginLoading = false;
      });
  }

  handleSession(result: LoginResponses): void {
    sessionStorage.setItem('username', this.loginModel.UserName);
    sessionStorage.setItem('clientCode', this.clientCode);

    if (result.UserDetails && result.UserDetails.IsMFAEnabledForWeb) {
      this.sessionService.setSesstionStorage(
        SessionKeys.Token,
        result.Token
      );

      this.isEnableTFAForWeb = true;

      return;
    }

    result.UIRolesCopy = result.UIRoles;

    this.sessionService.setSesstionStorage(
      SessionKeys.Token,
      result.Token
    );

    this.sessionService.setSesstionStorage(
      SessionKeys.LoginResponses,
      result
    );

    sessionStorage.setItem(
      'currentUser',
      result.UserSession.UserId.toString()
    );

    navigateToUrl('#/app-nav');
  }

  goToForgotPassword(): void {
    this.router.navigate(['../forgot-password'], {
      relativeTo: this.route,
      queryParams: {
        companyId: this._authenticationConfiguration.CompanyId,
        userType: this._authenticationConfiguration.UserType,
        clientCode: this.clientCode,
        authConfigId: this._authenticationConfiguration.Id
      }
    });
  }

  goToSsoLogin(): void {
    this.router.navigate(['../sso-login'], {
      relativeTo: this.route
    });
  }
}
