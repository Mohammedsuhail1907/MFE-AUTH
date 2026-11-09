import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { navigateToUrl } from 'single-spa';
import { environment } from '../../../environment/environment';
import { ActivatedRoute } from '@angular/router';
import { map, throwError } from 'rxjs';
import { AuthenticationService } from '../../core/services/authentication.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiResult } from '../../core/interface/base';
import { AuthenticationConfiguration, LoginModel, LoginResponses, NetworkDetails, GeoLocation, DeviceDetails } from '../../core/interface/auth.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { _DeviceDetails, _NetworkDetails, _BrowserDetails, _GeoLocation } from '../../core/constants/login.constants';
import { getBrowserDetails, getDeviceDetails, getNetworkDetails, getGeoLocation } from '../../core/utils/client-context.util';

import { AlertService } from '../../core/services/alert.service';
import { SessionStorageService } from '../../core/services/session-storage.service';
import { SessionKeys } from '../../core/enums/auth-enums';
import { SERVER_ERRORS, VALIDATION_MESSAGES, UI_LABELS } from '../../core/constants/messages.constants';

declare const __webpack_public_path__: string;

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {
  backgroundImageUrl = (() => {
    const raw = typeof __webpack_public_path__ !== 'undefined' && __webpack_public_path__ ? __webpack_public_path__ : '/';
    return (raw.endsWith('/') ? raw : `${raw}/`) + 'assets/images/building-pattern.svg';
  })();
  username!: string;
  authKey: string = '';
  private _destroyRef = inject(DestroyRef);
  public _authenticationConfiguration!: AuthenticationConfiguration;
  loginModel: LoginModel = {} as LoginModel;
  loginForm!: FormGroup;
  loginResponse!: LoginResponses;
  clientCode!: string;
  showForgotPassword: boolean = false;
  logoSrc: string = '/images/logoipsum-horz.svg';
  urlCode: string = '';

  // Loading states
  isLoginLoading: boolean = false;
  isGoogleLoginLoading: boolean = false;
  /** True while the initial config API call is in-flight — keeps the login button disabled */
  isInitialLoading: boolean = false;
  isEnableTFAForWeb: boolean = false;
  googlePlayUrl: string = '';
  appStoreUrl: string = '';
  isPasswordVisible: boolean = false;
  showHelpLink: boolean = false;
  helpLinkUrl: string = '';

  /** Expose message constants to the template */
  readonly SERVER_ERRORS = SERVER_ERRORS;
  readonly VALIDATION_MESSAGES = VALIDATION_MESSAGES;
  readonly UI_LABELS = UI_LABELS;

  /** Non-null when a server-side error occurs — replaces the login button with a friendly message */
  serverError: string | null = null;

  constructor(
    private acr: ActivatedRoute,
    private authService: AuthenticationService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private sessionService: SessionStorageService
  ) { }

  ngOnInit(): void {
    this.urlCode = environment.environment.urlCode || '';
    this.googlePlayUrl = environment.environment.GooglePlayUrl || environment.environment.googlePlayUrl || '';
    this.appStoreUrl = environment.environment.AppStoreUrl || environment.environment.appStoreUrl || '';
    this.showHelpLink = !!(environment.environment.ShowHelpLink ?? environment.environment.showHelpLink);
    this.helpLinkUrl = environment.environment.HelpLinkUrl || environment.environment.helpLinkUrl || '';
    this.acr.paramMap
      .pipe(map(params => params.get('clientCode')))
      .subscribe((clientCode: string | null) => {
        this.clientCode = clientCode ?? '';
        this.updateLogoSrc();

        // Reset error state on fresh navigation and start loading
        this.serverError = null;
        this.isInitialLoading = true;

        this.initial_api_request().subscribe({
          next: () => {
            this.isInitialLoading = false;
          },
          error: (error) => {
            this.isInitialLoading = false;
            const status = error?.status;
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
    this.createLoginForm();
  }

  private updateLogoSrc(): void {
    console.log('Client Code:', this.clientCode);
    const code = this.clientCode || environment.environment.urlCode || '';
    console.log('Logo URL:', code ? `/images/${code}-logo.png` : '/images/logoipsum-horz.svg');
    this.logoSrc = code ? `/images/${code}-logo.png` : '/images/logoipsum-horz.svg';
  }

  onLogoError(): void {
    console.log('Logo image error, using default logo');
    this.logoSrc = '/images/logoipsum-horz.svg';
  }

  createLoginForm() {
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  showForgotPasswordFlow() {
    this.showForgotPassword = true;
  }

  hideForgotPasswordFlow() {
    this.showForgotPassword = false;
  }

  initial_api_request() {
    const requestParams = `urlCode=${environment.environment.urlCode}&authKey=${this.authKey}`;
    return this.authService.getAuthenticationConfiguration(requestParams)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        map((data: any) => {
          const response = JSON.parse(data.Result);
          this._authenticationConfiguration = response;
          return response;
        })
      );
  }

  // final submission, session and verification
  login(): void {
    if (this.isLoginLoading) return; // Prevent multiple clicks

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoginLoading = true;

    // Clear session storage and template cache
    sessionStorage.clear();
    if (!this._authenticationConfiguration) {
      this.initial_api_request().subscribe({
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
    this.loginModel.AuthConfiguration = this._authenticationConfiguration;
    this.loginModel.CompanyId = this._authenticationConfiguration.CompanyId;
    this.loginModel.UserType = this._authenticationConfiguration.UserType;
    this.loginModel.ClientId = this._authenticationConfiguration.ClientId;
    this.loginModel.AuthType = this._authenticationConfiguration.AuthType;
    this.loginModel.UserName = this.loginForm.get('username')?.value;
    this.loginModel.Password = this.loginForm.get('password')?.value;
    this.loginModel.ClientCode = this.clientCode;
    this.loginModel.IMEI = '';

    const browser = getBrowserDetails();
    this.loginModel.Browser = browser || _BrowserDetails;

    Promise.allSettled([getDeviceDetails(), getGeoLocation(), getNetworkDetails()]).then(([devRes, locRes, netRes]) => {
      this.loginModel.Device = devRes.status === 'fulfilled' ? (devRes.value as DeviceDetails) : _DeviceDetails;
      this.loginModel.Location = locRes.status === 'fulfilled' ? (locRes.value as GeoLocation) : _GeoLocation;
      this.loginModel.Network = netRes.status === 'fulfilled' ? (netRes.value as NetworkDetails) : _NetworkDetails;

      const credential = JSON.stringify(this.loginModel);
      console.log(this.loginModel);
      this.authService.login(credential).pipe(takeUntilDestroyed(this._destroyRef)).subscribe({
        next: (data: ApiResult) => {
          console.log(data);
          if (data.Result && data.Status) {
            this.loginResponse = data.Result;
            try { this.Session_Subscription(this.loginResponse); } catch (Exception) { console.log('Exception Error: ', Exception); }
          } else {
            console.log(`Credential Error. ${data.Message}`);
            this.alertService.showError(data.Message);
          }
          this.isLoginLoading = false;
        },
        error: (err) => {
          console.log('Something is wrong! :', err);
          this.isLoginLoading = false;
          const status = err?.status;
          if (status >= 500) {
            this.serverError = SERVER_ERRORS.SERVER_ERROR;
          }
        }
      });
    });
  }

  openStore(url: string): void {
    if (!url) { return; }
    window.open(url, '_blank');
  }

  openHelpLink(): void {
    if (!this.helpLinkUrl) { return; }
    window.open(this.helpLinkUrl, '_blank');
  }

  togglePasswordVisible(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  // Google login method
  loginWithGoogle(): void {
    if (this.isGoogleLoginLoading) return;
    this.isGoogleLoginLoading = true;
    // Simulate Google login API call
  }

  Session_Subscription(result: LoginResponses) {
    console.log(result, 'Login Response');
    sessionStorage.setItem('username', this.loginModel.UserName);
    sessionStorage.setItem('clientCode', this.clientCode);
    if (result.UserDetails && result.UserDetails.IsMFAEnabledForWeb) {
      this.sessionService.setSesstionStorage(SessionKeys.Token, result.Token);
      this.isEnableTFAForWeb = true;
      return;
    }
    result.UIRolesCopy = result.UIRoles;
    this.sessionService.setSesstionStorage(SessionKeys.Token, result.Token);
    this.sessionService.setSesstionStorage(SessionKeys.LoginResponses, result);

    sessionStorage.setItem('currentUser', result.UserSession.UserId.toString());
    navigateToUrl('#/app-nav');
  }

  onSubmit() {
    console.log(environment.environment, environment.environment.SECURITY_BASE_URL);
    if (this.username.trim()) {
      sessionStorage.setItem('username', this.username);
      this.username = '';
      navigateToUrl('#/app-nav');
    } else {
      alert('Please enter a valid username.');
    }
  }
}
