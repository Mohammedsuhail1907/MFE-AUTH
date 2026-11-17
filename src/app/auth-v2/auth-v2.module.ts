import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthV2RoutingModule } from './auth-v2-routing.module';
import { AuthLayoutV2Component } from './components/auth-layout-v2/auth-layout-v2.component';
import { LoginV2Component } from './components/login-v2/login-v2.component';
import { ForgotPasswordV2Component } from './components/forgot-password-v2/forgot-password-v2.component';
import { ResetPasswordV2Component } from './components/reset-password-v2/reset-password-v2.component';
import { SsoLoginV2Component } from './components/sso-login-v2/sso-login-v2.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';



@NgModule({
  declarations: [
    AuthLayoutV2Component,
    LoginV2Component,
    ForgotPasswordV2Component,
    ResetPasswordV2Component,
    SsoLoginV2Component
  ],
  imports: [
    CommonModule,
    AuthV2RoutingModule,
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    RippleModule
  ]
})
export class AuthV2Module { }
