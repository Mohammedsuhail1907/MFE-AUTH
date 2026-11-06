import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmptyRouteComponent } from './empty-route/empty-route.component';

const routes: Routes = [
  { path: 'app-auth', redirectTo: 'app-auth/auth', pathMatch: 'full'},
  { path: '', redirectTo: 'app-auth/auth', pathMatch: 'full'},
  {
    path: 'app-auth/auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule)
  },
  { path: '**', component: EmptyRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
})
export class AppRoutingModule { }
