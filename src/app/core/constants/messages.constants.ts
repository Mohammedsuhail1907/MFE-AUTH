/**
 * Centralised message constants for mfe-auth.
 * All keys are UPPER_CASE with underscores.
 * Import and reference these instead of inline hardcoded strings.
 */

// ---------------------------------------------------------------------------
// Server / API error messages
// ---------------------------------------------------------------------------
export const SERVER_ERRORS = {
    SERVICE_UNAVAILABLE:
        'Service is currently unavailable. Please contact your administrator for further support.',
    ACCESS_DENIED:
        'Access denied due to a security issue. Please contact your administrator for assistance.',
    SERVER_ERROR:
        'A server error occurred. Please contact your administrator for support.',
    CONNECTION_FAILED:
        'Unable to connect to the server. Please try again or contact support.',
} as const;

// ---------------------------------------------------------------------------
// Form validation messages
// ---------------------------------------------------------------------------
export const VALIDATION_MESSAGES = {
    USERNAME_REQUIRED: 'Username is required',
    PASSWORD_REQUIRED: 'Password is required',
} as const;

// ---------------------------------------------------------------------------
// Button / UI label messages
// ---------------------------------------------------------------------------
export const UI_LABELS = {
    BTN_LOGIN: 'Login',
    BTN_LOGGING_IN: 'Logging in...',
    BTN_PLEASE_WAIT: 'Please wait...',
    FORGOT_PASSWORD: 'Forgot Password?',
    GET_HELP: 'Get Help',
    GET_OUR_APPS: 'Get our Apps',
} as const;

// ---------------------------------------------------------------------------
// Forgot password flow messages
// ---------------------------------------------------------------------------
export const FORGOT_PASSWORD_MESSAGES = {
    // Validation
    USERNAME_REQUIRED: 'Username is required',
    CAPTCHA_REQUIRED: 'Please complete the security verification',
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_MIN_LENGTH: 'Password must be at least 8 characters',
    CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
    PASSWORDS_MISMATCH: 'Passwords do not match',

    // OTP screen
    OTP_SENT_INFO: 'We have sent verification code to your registered email/mobile number',
    OTP_NOT_RECEIVED: "Didn't receive the OTP?",
    RESEND_OTP: 'Resend OTP',
    RESEND_OTP_LOADING: 'Sending...',

    // Button labels
    BTN_GET_OTP: 'Get OTP',
    BTN_SENDING_OTP: 'Sending OTP...',
    BTN_VERIFY: 'Verify',
    BTN_VERIFYING: 'Verifying...',
    BTN_RESET: 'Reset',
    BTN_RESETTING: 'Resetting...',
    BTN_BACK_TO_LOGIN: 'Back to Login',
    BTN_BACK: 'Back',

    // Password hints
    HINT_MIN_LENGTH: 'At least 8 characters',
    HINT_UPPER_CASE: 'One upper case letter',
    HINT_LOWER_CASE: 'One lower case letter',
    HINT_NUMBER: 'One number',
    HINT_SPECIAL_CHAR: 'One special character',
    HINT_HEADING: 'Your password must contain:',

    // Misc
    RESEND_IN: 'Resend in',
} as const;
