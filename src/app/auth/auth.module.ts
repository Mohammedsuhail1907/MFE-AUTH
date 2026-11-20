import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxCaptchaModule } from 'ngx-captcha';
import { AuthComponent } from './login/auth.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SharedModule } from '../shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { CandidateOtpComponent } from './candidate-otp/candidate-otp.component';
import { CommonOtpAuthenticationModule } from './otp-input-component/common-otp-auth.module';
import { CandidateUnauthorizedComponent } from './candidate-unauthorized/candidate-unauthorized.component';
import { AuthLayoutV2Component } from './auth-layout-v2/auth-layout-v2.component';
import { ResetPasswordV2Component } from './reset-password-v2/reset-password-v2.component';
import { SsoLoginV2Component } from './sso-login-v2/sso-login-v2.component';

@NgModule({
  declarations: [
    AuthComponent,
    ForgotPasswordComponent,
    CandidateOtpComponent,
    CandidateUnauthorizedComponent,

    AuthLayoutV2Component,
    ResetPasswordV2Component,
    SsoLoginV2Component
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    InputOtpModule,
    NgxCaptchaModule,
    SharedModule,
    CommonOtpAuthenticationModule,
    ButtonModule,
    RippleModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class AuthModule { }
