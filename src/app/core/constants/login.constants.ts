import { DeviceDetails, NetworkDetails, BrowserDetails, GeoLocation } from "../interface/auth.interface";

export const _DeviceDetails: DeviceDetails = {
    Id: 0,
    Type: 0,
    BrandName: '',
    Model: '',
    OSName: '',
    OSVersion: '',
    DeviceMemory: 0,
    HardwareConcurrency: 0,
    IsTouchCapable: false,
    ScreenOrientation: '',
    PixelDepth: 0,
    PixelRatio: 0
};

export const _NetworkDetails: NetworkDetails = {
    Id: 0,
    CompanyId: 0,
    ClientId: 0,
    IPAddresses: '',
    RouterPublicIPs: '',
    RouterPrivateIPs: '',
    Comments: ''
  
}

export const _BrowserDetails: BrowserDetails = {

    Id: 0,
    Name: '',
    Version: '',
    UserAgent: '',
    Language: '',
    Platform: '',
    CookieEnabled: false,
    ScreenResolution: ''
}

export const _GeoLocation: GeoLocation = {

    Id: 0,
    Latitude: 0,
    Longitude: 0,
    Radius: 0,
    RadiusDistanceIn: 0,
    Address: ''
}