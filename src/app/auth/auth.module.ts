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

@NgModule({
  declarations: [
    AuthComponent,
    ForgotPasswordComponent,
    CandidateOtpComponent,
    CandidateUnauthorizedComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    InputOtpModule,
    NgxCaptchaModule,
    SharedModule,
    ReactiveFormsModule,
    CommonOtpAuthenticationModule,
    ButtonModule,
    RippleModule
  ],
  providers: [
    provideHttpClient()
  ]
})
export class AuthModule { }
