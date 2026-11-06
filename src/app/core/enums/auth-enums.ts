
export enum DeviceType {
    All,
    Mobile,
    Browser
}

export enum AuthenticationType {

    Forms,
    ActiveDirectory,
    SSO
}

export enum SingleSignOnProvider {
    None,
    Google
}

export enum UserType {
    Any,
    Employee,
    ClientUser,
    CompanyUser,
    CoreUser
}

export enum TwoWayAuthenticationType {
    None,
    SMS,
    Email,
    SMSAndEmail
}

export enum SessionKeys {
    Company = 'Company',
    Token = 'Token',
    UserSession = 'UserSession',
    UserDetails = 'UserDetails',
    Implementation = 'Implementation',
    ImplementationCompany = 'ImplementationCompany',
    ModuleId = 'ModuleId',
    UserCompanyAppliationRoles = 'UserCompanyAppliationRole',
    ImplementationId = 'ImplementationId',
    ImplementationCompanyId = 'ImplementationCompanyId',
    ClientList = 'ClientBase',
    ClientContractList = 'ClientContractBase',
    CompanyLogoLink = 'CompanyLogoLink',
    ClientLogoLink = 'ClientLogoLink',
    LastLoggedInAt = 'LastLoggedInAt',
    LastPwdUpdatedOn = 'LastPwdUpdatedOn',
    IsSystemAdmin = 'IsSystemAdmin',
    Status = 'Status',
    LoginResponses = 'loginresponses'
}

export enum DistanceType {
    Meter,
    KiloMeter
}

export enum UserStatus {

    InActive,
    Active
}

export enum RoleType {

    Integrum,
    Employee,
    Client,
    Company,
    Candidate
}

export enum WebMenuItemType { Internal = 0, External = 1 }

export enum WebMenuItemTargetType { Self = 0, NewTab = 1, NewWindow = 2 }

export enum UIMode {
    None = 0,
    Edit = 1,
    Delete = 2
}

export enum AccessControlPropertyType {
    Properties,
    Permission
}