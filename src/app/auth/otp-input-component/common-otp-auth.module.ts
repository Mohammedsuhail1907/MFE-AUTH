// otp-input.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputOtpModule } from 'primeng/inputotp';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CommonOtpAuthentication } from './common-otp-auth.component';

@NgModule({
  declarations: [CommonOtpAuthentication],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputOtpModule,
    ButtonModule,
    RippleModule,
    ProgressSpinnerModule,
    SharedModule
  ],
  exports: [CommonOtpAuthentication]
})
export class CommonOtpAuthenticationModule { }