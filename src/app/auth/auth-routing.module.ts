import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './login/auth.component';
import { CandidateOtpComponent } from './candidate-otp/candidate-otp.component';
import { CandidateUnauthorizedComponent } from './candidate-unauthorized/candidate-unauthorized.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { AuthLayoutV2Component } from './auth-layout-v2/auth-layout-v2.component';
import { ResetPasswordV2Component } from './reset-password-v2/reset-password-v2.component';
import { SsoLoginV2Component } from './sso-login-v2/sso-login-v2.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: AuthComponent },
  { path: 'login/:clientCode', component: AuthComponent },

  { path: 'candidateauthentication', component: CandidateOtpComponent },
  { path: 'candidateunauthrorized', component: CandidateUnauthorizedComponent },

  {
    path: 'forgot-password',
    component: AuthLayoutV2Component,
    children: [
      { path: '', component: ForgotPasswordComponent }
    ]
  },

  {
    path: 'reset-password',
    component: AuthLayoutV2Component,
    children: [
      { path: '', component: ResetPasswordV2Component }
    ]
  },

  {
    path: 'sso-login',
    component: AuthLayoutV2Component,
    children: [
      { path: '', component: SsoLoginV2Component }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }