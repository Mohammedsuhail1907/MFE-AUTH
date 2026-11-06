import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class DynamicEnvService {
  
  async setEnvironment(config: any): Promise<void> {
    console.log('Dynamic env service', config);
    environment.setEnvironment(config);
  }
}
