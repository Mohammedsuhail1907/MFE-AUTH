import './set-public-path';
import { NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router, NavigationStart } from '@angular/router';
import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
import type { LifeCycleFn, AppProps } from 'single-spa';

import { AppModule } from './app/app.module';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';

declare const __webpack_public_path__: string;

// disable Angular SW when running as an MFE inside mfe-root
(window as any).__HF_SINGLE_SPA__ = true;
// expose webpack public path so Angular components can build asset URLs
(window as any).__hf_auth_public_path__ = typeof __webpack_public_path__ !== 'undefined' ? __webpack_public_path__ : '/';

const rawPublic = typeof __webpack_public_path__ !== 'undefined' && __webpack_public_path__ ? __webpack_public_path__ : '/';
const publicPath = rawPublic.endsWith('/') ? rawPublic : `${rawPublic}/`;

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  template: `<auth-root><div class="hf-boot-wrap"><div class="hf-boot-spinner"><img class="hf-boot-logo" src="${publicPath}assets/images/hfactor-logo-dark.png" alt="HfactoR" /></div></div></auth-root>`,
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = (props: AppProps): Promise<void> =>
  (lifecycles.mount as LifeCycleFn<AppProps>)(props);
export const unmount = lifecycles.unmount;

// Auto-bootstrap when running standalone (direct navigation to http://localhost:4800 outside single-spa shell)
if (!(window as any).singleSpaNavigate && !(window as any).singleSpa) {
  platformBrowserDynamic()
    .bootstrapModule(AppModule, { ngZoneEventCoalescing: true })
    .catch(err => console.error('[mfe-auth] Standalone bootstrap error:', err));
}

