import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DynamicEnvService } from './dynamic-env.service';

declare let __webpack_public_path__: string;

@Injectable({
  providedIn: 'root'
})
export class InitService {
private initialized: boolean = false;
  private initializationSubject = new BehaviorSubject<boolean>(false);

  constructor(private dynamicEnvService: DynamicEnvService) {
    console.log('Welcome to the console of HrSuiteUI!!')
  }

  async init(): Promise<void> {
    try {
      const rawBase = (typeof __webpack_public_path__ !== 'undefined' && __webpack_public_path__) ? __webpack_public_path__ : '/';
      const baseUrl = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
      console.log('BASE_REF', baseUrl);
      const response = await fetch(`${baseUrl}assets/json/config.json?v=${new Date().getTime()}`);
    const data = await response.json();
    if (data.IsConsoleLogRequired === false && window) {
      window.console.log = window.console.warn = window.console.info = function () { };
    }
    await this.dynamicEnvService.setEnvironment(data);
    this.initialized = true;
    this.initializationSubject.next(true);
  } catch(error) {
    console.error('Error during initialization', error);
      this.initializationSubject.error(error);
  }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  onInitialized(): Observable<boolean> {
    return this.initializationSubject.asObservable();
  }
}
