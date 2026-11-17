
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutV2Component } from './components/auth-layout-v2/auth-layout-v2.component';
import { LoginV2Component } from './components/login-v2/login-v2.component';
import { ForgotPasswordV2Component } from './components/forgot-password-v2/forgot-password-v2.component';
import { ResetPasswordV2Component } from './components/reset-password-v2/reset-password-v2.component';
import { SsoLoginV2Component } from './components/sso-login-v2/sso-login-v2.component';

const routes: Routes = [
  {
    path: '',
    component: AuthLayoutV2Component,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: LoginV2Component
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordV2Component
      },
      {
        path: 'reset-password',
        component: ResetPasswordV2Component
      },
      {
        path: 'sso-login',
        component: SsoLoginV2Component
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthV2RoutingModule { }
