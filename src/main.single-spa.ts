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

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    singleSpaPropsSubject.next(singleSpaProps);
    return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AppModule);
  },
  template: `<auth-root><div class="hf-boot-wrap"><div class="hf-boot-spinner"><img class="hf-boot-logo" src="${__webpack_public_path__}assets/images/hfactor-logo-dark.png" alt="HfactoR" /></div></div></auth-root>`,
  Router,
  NavigationStart,
  NgZone,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = (props: AppProps): Promise<void> =>
  (lifecycles.mount as LifeCycleFn<AppProps>)(props);
export const unmount = lifecycles.unmount;
