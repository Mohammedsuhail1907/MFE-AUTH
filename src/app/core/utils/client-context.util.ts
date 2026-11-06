import { BrowserDetails, DeviceDetails, GeoLocation, NetworkDetails } from "../interface/auth.interface";
import { DeviceType, DistanceType } from "../enums/auth-enums";

export function getBrowserDetails(): BrowserDetails {
  const ua = navigator.userAgent;
  let name = '';
  let version = '';
  let m: RegExpMatchArray | null;
  if ((m = ua.match(/Edg\/(\d+\.\d+)/))) { name = 'Edge'; version = m[1]; }
  else if ((m = ua.match(/OPR\/(\d+\.\d+)/))) { name = 'Opera'; version = m[1]; }
  else if ((m = ua.match(/Chrome\/(\d+\.\d+)/)) && !ua.includes('Edg')) { name = 'Chrome'; version = m[1]; }
  else if ((m = ua.match(/Firefox\/(\d+\.\d+)/))) { name = 'Firefox'; version = m[1]; }
  else if ((m = ua.match(/Version\/(\d+\.\d+).*Safari/))) { name = 'Safari'; version = m[1]; }
  else { name = (navigator as any).userAgentData?.brands?.[0]?.brand || 'Unknown'; version = ''; }
  
  return { 
    Id: 0, 
    Name: name, 
    Version: version,
    UserAgent: ua,
    Language: navigator.language,
    Platform: navigator.platform,
    CookieEnabled: navigator.cookieEnabled,
    ScreenResolution: `${window.screen.width}x${window.screen.height}`
  } as BrowserDetails;
}

function getGPUInfo(): { renderer: string; vendor: string } {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (gl) {
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      if (ext) {
        return {
          renderer: gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '',
          vendor: gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || ''
        };
      }
    }
  } catch {}
  return { renderer: '', vendor: '' };
}

export async function getDeviceDetails(): Promise<DeviceDetails> {
  const ua = navigator.userAgent;
  let osName = 'Unknown';
  let osVersion = '';
  let m: RegExpMatchArray | null;
  if ((m = ua.match(/Windows NT ([0-9.]+)/))) { osName = 'Windows'; osVersion = m[1]; }
  else if ((m = ua.match(/Android ([0-9.]+)/))) { osName = 'Android'; osVersion = m[1]; }
  else if ((m = ua.match(/iPhone|iPad|iPod.*OS ([0-9_]+)/))) { osName = 'iOS'; osVersion = m[1]?.replace(/_/g, '.') || ''; }
  else if ((m = ua.match(/Mac OS X ([0-9_]+)/))) { osName = 'macOS'; osVersion = m[1]?.replace(/_/g, '.') || ''; }
  else if (ua.includes('Linux')) { osName = 'Linux'; }
  const type = /Mobi|Android/.test(ua) ? DeviceType.Mobile : DeviceType.Browser;

  const nav = navigator as any;
  const gpu = getGPUInfo();

  let batteryLevel: number | undefined;
  let batteryCharging: boolean | undefined;
  try {
    if (nav.getBattery) {
      const battery = await nav.getBattery();
      batteryLevel = Math.round(battery.level * 100);
      batteryCharging = battery.charging;
    }
  } catch {}

  return {
    Id: 0,
    Type: type,
    BrandName: '',
    Model: '',
    OSName: osName,
    OSVersion: osVersion,
    DeviceMemory: nav.deviceMemory || 0,
    HardwareConcurrency: nav.hardwareConcurrency || 0,
    IsTouchCapable: nav.maxTouchPoints > 0 || nav.msMaxTouchPoints > 0,
    ScreenOrientation: screen.orientation?.type || (window.screen as any).mozOrientation || (window.screen as any).msOrientation || '',
    PixelDepth: window.screen.pixelDepth,
    PixelRatio: window.devicePixelRatio,
    Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    ColorDepth: window.screen.colorDepth,
    AvailableScreenResolution: `${window.screen.availWidth}x${window.screen.availHeight}`,
    GPURenderer: gpu.renderer,
    GPUVendor: gpu.vendor,
    DoNotTrack: nav.doNotTrack ?? (window as any).doNotTrack ?? '',
    BatteryLevel: batteryLevel,
    BatteryCharging: batteryCharging
  } as DeviceDetails;
}

async function getLocalIPs(): Promise<string[]> {
  const ips: string[] = [];
  try {
    const pc = new RTCPeerConnection({ iceServers: [] });
    pc.createDataChannel('');
    await pc.createOffer().then(offer => pc.setLocalDescription(offer));
    await new Promise<void>(resolve => {
      const timeout = setTimeout(() => { pc.close(); resolve(); }, 1500);
      pc.onicecandidate = e => {
        if (!e.candidate) { clearTimeout(timeout); pc.close(); resolve(); return; }
        const match = e.candidate.candidate.match(/([0-9]{1,3}(?:\.[0-9]{1,3}){3})/);
        if (match && !ips.includes(match[1]) && !match[1].startsWith('0.')) {
          ips.push(match[1]);
        }
      };
    });
  } catch {}
  return ips;
}

export async function getNetworkDetails(): Promise<NetworkDetails> {
  let publicIp = '';
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const j = await r.json();
    publicIp = j?.ip || '';
  } catch {}

  const localIps = await getLocalIPs();
  const privateIps = localIps.filter(ip => /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.)/.test(ip));

  const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const connInfo = conn ? {
    type: conn.type,
    effectiveType: conn.effectiveType,
    downlink: conn.downlink,
    downlinkMax: conn.downlinkMax,
    rtt: conn.rtt,
    saveData: conn.saveData
  } : {};

  return {
    Id: 0,
    CompanyId: 0,
    ClientId: 0,
    IPAddresses: publicIp,
    RouterPublicIPs: publicIp,
    RouterPrivateIPs: privateIps.join(', '),
    Comments: JSON.stringify({ allLocalIPs: localIps, connection: connInfo }),
    ConnectionType: connInfo.type || '',
    EffectiveType: connInfo.effectiveType || '',
    Downlink: connInfo.downlink,
    Rtt: connInfo.rtt,
    SaveData: connInfo.saveData
  } as NetworkDetails;
}

export async function getGeoLocation(): Promise<GeoLocation> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject();
      return;
    }
    const permissions = (navigator as any).permissions;
    if (permissions && permissions.query) {
      permissions.query({ name: 'geolocation' as any }).then((status: any) => {
        if (status.state === 'granted') {
          navigator.geolocation.getCurrentPosition(
            pos => {
              const lat = pos.coords.latitude || 0;
              const lon = pos.coords.longitude || 0;
              resolve({ Id: 0, Latitude: lat, Longitude: lon, Radius: 0, RadiusDistanceIn: DistanceType.Meter, Address: '' } as GeoLocation);
            },
            () => reject(),
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
          );
        } else {
          reject();
        }
      }).catch(() => {
        reject();
      });
    } else {
      reject();
    }
  });
}

