import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonOtpAuthentication } from './common-otp-auth.component';


describe('CommonOtpAuthComponent', () => {
  let component: CommonOtpAuthentication;
  let fixture: ComponentFixture<CommonOtpAuthentication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommonOtpAuthentication]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CommonOtpAuthentication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
