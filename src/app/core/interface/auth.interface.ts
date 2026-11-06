import { AccessControlPropertyType, AuthenticationType, DeviceType, DistanceType, RoleType, SingleSignOnProvider, TwoWayAuthenticationType, UIMode, UserStatus, UserType, WebMenuItemTargetType, WebMenuItemType } from "../enums/auth-enums";
import { BaseModel } from "./base";

export interface AuthenticationConfiguration extends BaseModel {

    KeyName: string;
    Description: string;
    CompanyId: number;
    ClientId: number;
    AuthType: AuthenticationType;
    UserType: UserType;
    PermissableDeviceType: DeviceType;
    TwoWayAuthType: TwoWayAuthenticationType;
    SSOProviderId: number;
    PermissableNetworkId: number;
    PermissableGeoLocationId: number;
    Status: number;
    MaxWrongAttempts: number;
    AutoUnLockMinutes: number;
    AllowMultiBrowserLogin: boolean;
    AllowMultiDeviceLogin: boolean;
    SSOProvider: SingleSignOnProvider;
    PermissableNetwork: NetworkDetails[];
    PermissableGeoLocation: GeoLocation[];
    IsCaptchaRequired?: boolean;

}


export interface LoginModel {

    AuthConfiguration: AuthenticationConfiguration;
    CompanyId: number;
    SSOEmailId: string;
    UserType: UserType;
    ClientId: number;
    UserName: string;
    Password: string;
    Location: GeoLocation;
    IMEI: string;
    Network: NetworkDetails;
    Browser: BrowserDetails;
    Device: DeviceDetails;
    AuthType: AuthenticationType;
    ClientCode: string;
}



export interface LoginResponses {

    Company: Company;
    Token: string;
    UserSession: UserSession;
    UserDetails: UserDetails;
    Implementation: Implementation;
    ImplementationCompany: ImplementationCompany;
    ModuleId: number;
    UserCompanyAppliationRoles: UserCompanyAppliationRole[];
    ImplementationId: number;
    ImplementationCompanyId: number;
    EmployeeId: number;
    ClientList: ClientBase[];
    ClientContractList: ClientContractBase[];
    CompanyLogoLink: string;
    ClientLogoLink: string;
    LastLoggedInAt: Date | string;
    LastPwdUpdatedOn: Date | string;
    IsSystemAdmin: boolean;
    UIRoles: Roles[];
    Status: boolean;
    Key: string;
    Vector: string;
    UIRolesCopy?: Roles[];
}

export interface NetworkDetails extends BaseModel {

    CompanyId: number;
    ClientId: number;
    IPAddresses: string;
    RouterPublicIPs: string;
    RouterPrivateIPs: string;
    Comments: string;
    ConnectionType?: string;
    EffectiveType?: string;
    Downlink?: number;
    Rtt?: number;
    SaveData?: boolean;
  
}

export interface GeoLocation {
    Id: number;
    Latitude: number;
    Longitude: number;
    Radius: number;
    RadiusDistanceIn: DistanceType;
    Address: string;
}

export interface BrowserDetails {
    Id: number;
    Name: string;
    Version: string;
    UserAgent: string;
    Language: string;
    Platform: string;
    CookieEnabled: boolean;
    ScreenResolution: string;
}

export interface DeviceDetails {
    Id: number;
    Type: DeviceType;
    BrandName: string;
    Model: string;
    OSName: string;
    OSVersion: string;
    DeviceMemory?: number;
    HardwareConcurrency?: number;
    IsTouchCapable?: boolean;
    ScreenOrientation?: string;
    PixelDepth?: number;
    PixelRatio?: number;
    Timezone?: string;
    ColorDepth?: number;
    AvailableScreenResolution?: string;
    GPURenderer?: string;
    GPUVendor?: string;
    DoNotTrack?: string;
    BatteryLevel?: number;
    BatteryCharging?: boolean;
}

export interface Company extends BaseModel {

    Code: string;
    Name: string;
    Description: string;
    IsActive: boolean;
    OrganizationDetails: Organization;
    IsDefault: boolean;
    OrganizationId: number;
    LstCompanyModule: CompanyModule[];
    LstCompanyBusinessTypeMapping: CompanyBusinessTypeMapping[];
}

/** 
 * Authenticates the user.
  * @return The user session details of UserSession.
 */

export interface UserSession {

    Token: string;
    UserId: number;
    PersonId: number;
    PersonName: string;
    CreatedOn: Date | string;
    LastCheckedOn: Date | string;
    IPAddress: string;
    RouterPublicIP: string;
    RouterPrivateIP: string;
    IMEI: string;
    BrowserDetails: BrowserDetails;
    LocationDetails: GeoLocation;
    LocationJson: string;
    BrowserJson: string;
    MobileNumber: string;
    EmailId: string;
    UserType: string;
    Id: number;

}

/** 
 * Authenticates the user.
  * @return The user details of authentication.
 */
export interface BaseUserDetails {

    UserId: number;
    Name: string;
}

export interface UserDetails extends BaseUserDetails {

    PersonId: number;
    UserName: string;
    Password: string;
    MobileNo: string;
    EmailId: string;
    SystemUserCode: string;
    OtherUserCode: string;
    AuthenticationConfigurationId: number;
    UserType: UserType;
    Status: UserStatus;
    LastLoggedInAt: Date | string;
    WrongAttempts: number;
    IsLocked: boolean;
    LockedOn: Date | string;
    CreatedOn: Date | string;
    LastUpdatedOn: Date | string;
    CreatedBy: string;
    LastUpdatedBy: string;
    IsMFAEnabledForWeb: boolean;
    IsMFAEnabledForMobile: boolean;

}




export interface Implementation extends BaseModel {

    // Id: number;
    Code: string;
    Name: string;
    Decription: string;
    //public long ApplicationId
    Application: Application;
    Company: Company;
    Country: Country;
    Properties: { [key: string]: any };
    //Properties: string;

}

export interface Application extends BaseModel {

    Code: string;
    Name: string;
    Description: string;
    IsActive: boolean;
    VersionList: ApplicationVersion[];
    LstModule: Module[];

}


export interface ApplicationVersion extends BaseModel {
    //Id: number;
    Version: string;
    ReleaseDate: Date | string;
    Properties: { [key: string]: any };
    ApplicableCountryList: Country[];
    ApplicableCompanyList: Company[];
    ApplicableImplementationList: Implementation[];
}

export interface Module extends BaseModel {

    Code: string;
    Name: string;
    Description: string;
    Status: number;
    ApplicationId: number;
}

export interface Organization extends BaseModel {

    Code: string;
    SectorType: number;
    ParentId: number;

}
export interface Country extends BaseModel {
    Code: string;
    Name: string;
}

export interface CompanyModule {

    Id: number;
    ModuleId: number;
    CompanyId: number;
    Module: Module;
}

export interface CompanyBusinessTypeMapping {

    Id: number;
    CompanyId: number;
    BusinessType: number;
}


export interface ImplementationCompany extends BaseModel {

    //[DBColumnName(DaConstants.CORE_COL_ID, IsIdentity = true)]
    //Id: number;

    ImplementationId: number;
    CompanyId: number;
    BOPath: string;
    Properties: { [key: string]: any };

}



export interface UserCompanyAppliationRole {

    Id: number;
    UserId: number;
    CompanyApplicationRoleId: number;
    CompanyId: number;
    CompanyApplicationRole: CompanyApplicationRole;
    Modetype: UIMode;
    Status: number;

}

export interface UserGroupAndUserMapping {
    Id: number;
    UserGroupId: number;
    RoleId: number;
    UserId: number;
}

export interface Roles {

    Role: Role;
    AccessControls: AccessControl;
    UserInterfaceControls: UserInterfaceControls;
    WebMenuItemList: WebMenuItemList[]

}

export interface WebMenuItemList {
    ChildMenuItems: WebMenuItemList[];
    DisplayOrder: number;
    Icon: string | null;
    MenuName: string;
    Route: string;
    TargetType: WebMenuItemTargetType;
    Type: WebMenuItemType;
    IsVisible: boolean;
}



export interface CompanyApplicationRole {
    Id: number;

    Properties: string;

    CompanyId: number;

    RoleId: number;

    Status: number;

    Role: Role;

    CompanyModuleRoles: CompanyModuleRole[];

}

export interface ClientBase extends BaseModel {
    Code: string;
    Name: string;
    OrganizationId: number;
    CompanyId: number;
    IsDefault: boolean;
    ClientLogoURL: any;

}


export interface ClientContractBase extends BaseModel {
    Code: string;
    Name: string;
    ClientId: number;
}

export interface Role extends BaseModel {

    Code: string;

    Name: string;

    Roletype: RoleType;

    Description: string;

    Status: number;

}


export interface UserHierarchyRole {
    IsCompanyHierarchy: boolean;
    AttributeId?: number;
    AttributeName?: string;
    AttributeValueId?: number;
    AttributeValueName?: string;
    AttributeValuePropertyId?: number;
    AttributeValuePropertyName?: string;
    RoleCode: string;
    RoleId: number;
}


export interface CompanyModuleRole {
    Id: number;

    CompanyModuleId: number;

    CompanyApplicationRoleId: number;

    DisplayName: string;

    CompanyModule: CompanyModule;

    CompanyRoleProfileMappings: CompanyRoleProfileMapping[];
    Modetype: UIMode;
}

export interface CompanyRoleProfileMapping {
    Id: number;

    CompanyModuleRoleId: number;

    CompanyModuleProfileId: number;

    IsOverride: number;

    ClientId: number;

    ClientContractId: number;

    Modetype: UIMode;
    CompanyModuleProfile: CompanyModuleProfile;

}


export interface CompanyModuleProfile {
    Id: number;

    CompanyModuleId: number;

    ProfileId: number;

    DisplayName: string;

    Profile: Profile;

    CompanyModule: CompanyModule;
    ProfileAccessControlLst: ProfileAccessControl[];

}

export interface Profile extends BaseModel {
    Code: string;

    Name: string;

    Description: string;

    Status: number;


}

export interface ProfileAccessControl {
    Id: number;

    CompanyModuleProfileId: number;

    AccessControlGroupId: number;

    AccessControlId: number;

    IsOverride: boolean;

    Properties: string;

    DisplayName: string;

    Class: string;

    Query: string;

    Modetype: UIMode;
    AccessControlGroup: AccessControlGroup;

    AccessControl: AccessControl;


}

export interface AccessControlGroup extends BaseModel {
    Code: string;

    Description: string;

    GroupAccessControlMappings: GroupAccessControlMapping[];
    LstAccessControl: AccessControl[];
}

export interface GroupAccessControlMapping {
    Id: number;

    AccessControlGroupId: number;

    AccessControlId: number;

    AccessControlTypePropertyId: number;

    Value: string;

    Modetype: UIMode;

    AccessControlPropertyTypeId: AccessControlPropertyType;
}





export interface AccessControlTypeProperties extends BaseModel {
    Code: string;

    Description: string;

    AccessControlTypeId: number;

    Modetype: UIMode;

    AccessControlPropertyTypeId: AccessControlPropertyType;

}

export interface AccessControlPropertyvalue {
    Id: number;

    AccessControlId: number;

    AccessControlTypePropertyId: number;

    value: string;

    AccessControlPropertyTypeId: AccessControlPropertyType;
    AccessControlTypeProperties: AccessControlTypeProperties;
    Modetype: UIMode;
}

export interface AccessControlType {

    Id: number;
    Code: string;
    Description: string;
    LstPermission: AccessControlTypeProperties[];
    LstProperties: AccessControlTypeProperties[];

}

export interface ChildAccessControls extends BaseModel {

    Code: string;
    AccessControlTypeId: number;
    ControlName: string;
    ParentId: number;
    Properties: AccessControlPropertyvalue[];
    Permissions: AccessControlPropertyvalue[];
    AccessControlType: AccessControlType;

}

export interface AccessControl extends BaseModel {

    Code: string;
    AccessControlTypeId: number;
    ControlName: string;
    ParentId: number;
    Properties: AccessControlPropertyvalue[];
    Permissions: AccessControlPropertyvalue[];
    AccessControlType: AccessControlType;
    ChildAccessControls: ChildAccessControls;
    DisplayOrder: number;
}

export interface UserInterfaceControls {

    AccessControlId : number;
    ControlName: string;
    MenuId: number;
    ParentControlId: number;
    PropertyType: number;
    AccessControlTypeName: string;
    PropertyName: string;
    PropertyValue: string;
    GroupControlName : string;
  
  }