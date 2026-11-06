export const api_endpoints = {
    appTitle: 'HR Suite',
    appLogo: '/assets/images/logo/logo.jpg',
    SECURITY_ENDPOINT: "api/Security/GetAuthConfigByUrlCodeAndAuthKey?",
    SECURITY_COMPANYANDCLIENT_ENDPOINT: '/api/Security/GetAuthConfigDataByCompanyAndClient?',
    SECURITY_REQUESTOTP: '/api/Security/RequestOtpToResetPwd?',
    SECURITY_VALIDATEOTP: '/api/Security/ValidateOtpForPwdReset',
    SECURITY_UPDATEPASSWORD: '/api/Security/UpdatePassword',
    SECURITY_AUTHENTICATION: '/api/Security/AuthenticateUser',
    SECURITY_LOGOUT: 'api/Security/Logout',
    SECURITY_CHANGEPASSWORD: '/api/Security/ChangePassword',
    SECURITY_UPDATEROLEINSESSION: 'api/Security/UpdateRoleInSession',
    SECURITY_SENDTOP: 'api/OTP/SendOTPForApprovalRequest',
    SECURITY_VERIFYTOP: 'api/OTP/VerifyApprovalRequestOTP',
    SECURITY_GETMENUITEMSBYCLIENTID: 'api/Security/GetMenuByUserAndClient?',

    SECURITY_GENERATESECRETKEY: 'api/TwoFactorAuthenticator/GenerateQRCode',
    SECURITY_VERIFYCODE: 'api/TwoFactorAuthenticator/VerifyCode',
    SECURITY_SENDOTPFORMFA: 'api/Security/SendOTPForMFA',
    SECURITY_GENERATEQRCODEFORMFA: 'api/Security/GetQRCodeForMFA/',
    SECURITY_ENABLEMFA: 'api/Security/EnableMFA',
    SECURITY_DISABLEMFA: 'api/Security/DisableMFA',
    SECURITY_VERIFYMFA: 'api/Security/VerifyMFA/',

    // Candidate and OTP Screens
    CANDIDATE_LOGIN: 'api/OTP/LoginCandidate?',
    VERIFICATION_LINK: 'api/OTP/GetValidInputTransactionData',
    GET_UIOFFERDATA: 'api/OnBoarding/GetCanddateUIOfferData?',
    PUT_ACCEPTANCEREJECTION: 'api/OnBoarding/UpdateCandidateAccepatanceRejection?',
    POSTWORKFLOW: 'api/WorkFlow/CreateWorkFlowRequest'

}