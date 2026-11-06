import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-common-otp-auth',
  standalone: false,
  templateUrl: './common-otp-auth.component.html',
  styleUrl: './common-otp-auth.component.scss'
})
export class CommonOtpAuthentication {
  @Input() title: string = 'Verify Your Account';
  @Input() labelText: string = 'Enter your OTP sent to your number';
  @Input() isLoading: boolean = false;
  @Input() isPageLoading: boolean = false;
  @Input() image: any = ''
  @Input() otpLength: number = 5;
  @Input() BusinessType: number = 3;
  @Output() otpSubmit = new EventEmitter<string>();
  @Output() resend = new EventEmitter<void>();


  hideResend: boolean = false;
  otpForm: FormGroup;
  countdown: number = 30;
  isTimerRunning: boolean = true;
  private timerInterval: any;

  footerConfig = environment.environment.Footer;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      otp: ['', [
        Validators.required,
        Validators.pattern(/^[A-Z0-9]+$/),
        Validators.minLength(this.otpLength),
        Validators.maxLength(this.otpLength)
      ]]
    });
  }

  ngOnInit() {
    this.startTimer();
  }

  ngOnChanges() {
    // Update validators if otpLength is changed dynamically
    this.otpForm.get('otp')?.setValidators([
      Validators.required,
      Validators.pattern(/^[A-Z0-9]+$/),
      Validators.minLength(1),
      Validators.maxLength(this.otpLength)
    ]);
    this.otpForm.get('otp')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.otpForm.valid) {
      console.log('OTP Submitted:', this.otpForm.value.otp);
      this.otpSubmit.emit(this.otpForm.value.otp);
    }
    else {
      console.log('Invalid OTP');
      this.otpForm.markAllAsTouched();
    }
  }

  onInputChange(event: any) {
    event.target.value = event.target.value.replace(/\D/g, '');
  }

  startTimer() {
    this.countdown = 30;
    this.isTimerRunning = true;
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;
      }
    }, 1000);
  }

  resendCode() {
    if (this.isTimerRunning) return;

    console.log('Resending code...');

    this.startTimer();
    this.resend.emit();
  }
}
