import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import CryptoJS from 'crypto-js';
import { SessionStorageService  as NgxSessionStorage } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  private storageSub = new Subject<string>();

  EncrpytKey = '7061737323313233';
  private sessionStorageService = inject(NgxSessionStorage);

  constructor() { }

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  setItem(key: string, data: any) {
    sessionStorage.setItem(key, data);
    this.storageSub.next(sessionStorage.getItem('isEmployee') || "");
  }

  removeItem(key: any) {
    sessionStorage.removeItem(key);
    this.storageSub.next(sessionStorage.getItem('isEmployee') || "");
  }


  setSesstionStorage(key: any, value: any) {
    let ciphertext;

    if (this.toJson(value)) {

      ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), this.EncrpytKey);
    } else {

      ciphertext = CryptoJS.AES.encrypt(value.toString(), this.EncrpytKey);
    }
    this.sessionStorageService.store(key, ciphertext.toString());

  }

  getSessionStorage(key: any) {

    let decryptedData = null;
    let bytes;

    const value = this.sessionStorageService.retrieve(key);
    if (value != null) {
      if (this.toJson(value)) {
        bytes = CryptoJS.AES.decrypt(value.toString(), this.EncrpytKey);
        decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      } else {
        bytes = CryptoJS.AES.decrypt(value.toString(), this.EncrpytKey);
        decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      }
    }
    return decryptedData;
  }

  delSessionStorage(key: any) {

    this.sessionStorageService.clear(key);
    sessionStorage.removeItem(key);

  }

  clearSessionStorage() {

    sessionStorage.clear();
    this.sessionStorageService.clear();
  }


  toJson(item: any) {
    item = typeof item !== 'string'
      ? JSON.stringify(item)
      : item;

    try {
      item = JSON.parse(item);
    } catch (e) {
      return false;
    }

    if (typeof item === 'object' && item !== null) {
      return true;
    }

    return false;
  };
}
