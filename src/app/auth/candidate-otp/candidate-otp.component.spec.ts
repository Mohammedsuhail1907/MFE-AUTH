import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateOtpComponent } from './candidate-otp.component';


describe('CandidateOtpComponent', () => {
  let component: CandidateOtpComponent;
  let fixture: ComponentFixture<CandidateOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the otp control if empty', () => {
    const control = component.otpForm.get('otp');
    control?.setValue('');
    control?.markAsTouched();
    fixture.detectChanges();
    expect(control?.hasError('required')).toBeTrue();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.text-danger')?.textContent).toContain('OTP is required.');
  });

  it('should invalidate otp if not a number', () => {
    const control = component.otpForm.get('otp');
    control?.setValue('abc');
    control?.markAsTouched();
    fixture.detectChanges();
    expect(control?.invalid).toBeTrue();
  });

  it('should invalidate if otp is less than 5 digits', () => {
    const control = component.otpForm.get('otp');
    control?.setValue('123');
    control?.markAsTouched();
    fixture.detectChanges();
    if (control?.validator) {
      expect(control.hasError('minlength') || control.hasError('min')) 
        .withContext('Should have minlength/min errors with too-short otp')
        .toBeTrue();
    }
  });

  it('should invalidate if otp is more than 5 digits', () => {
    const control = component.otpForm.get('otp');
    control?.setValue('123456');
    control?.markAsTouched();
    fixture.detectChanges();
    if (control?.validator) {
      expect(control.hasError('maxlength') || control.hasError('max')) 
        .withContext('Should have maxlength/max errors with too-long otp')
        .toBeTrue();
    }
  });

  it('should render the header and resend code text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Verify Your Account');
    expect(compiled.textContent).toContain("Didn't receive the code?");
    expect(compiled.textContent).toContain('Resend Code');
  });

});
