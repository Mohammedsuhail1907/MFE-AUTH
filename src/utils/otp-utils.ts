import { environment } from '../environment/environment';

export function validateOtp(otp: string | number | null | undefined, alertService: { showInfo(msg: string): void }): boolean {
  const OTP_LENGTH = environment.environment.candidateAuth?.OTPLength || 5;
  const otpStr = String(otp ?? '').trim();

  if (otpStr === '') {
    alertService.showInfo('Please enter the OTP to continue.');
    return false;
  }

  if (!/^\d+$/.test(otpStr)) {
    alertService.showInfo('OTP must contain only numeric digits.');
    return false;
  }

  if (otpStr.length !== OTP_LENGTH) {
    alertService.showInfo(`Please enter a valid ${OTP_LENGTH}-digit OTP.`);
    return false;
  }

  return true;
}