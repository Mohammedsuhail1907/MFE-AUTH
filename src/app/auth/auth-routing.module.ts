import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './login/auth.component';
import { CandidateOtpComponent } from './candidate-otp/candidate-otp.component';
import { CandidateUnauthorizedComponent } from './candidate-unauthorized/candidate-unauthorized.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  { path: 'login', component: AuthComponent },
  { path: 'login/:clientCode', component: AuthComponent },
  { path: 'candidateauthentication', component: CandidateOtpComponent },
  { path: 'candidateunauthrorized', component: CandidateUnauthorizedComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
