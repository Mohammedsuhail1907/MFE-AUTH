import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, map, catchError, throwError, of } from 'rxjs';
import { environment } from '../../../environment/environment';
import { api_endpoints } from '../api_enpoints';
import { ApiResult, VerificatinLogs } from '../interface/base';
import { SessionKeys } from '../enums/auth-enums';
import CryptoJS from 'crypto-js';
import { SessionStorageService } from './session-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  httpOptions: any;
  httpOptions2: any;
  tokenHttpOptions: any;
  HFK = 'zvj51koevcsjujj6';
  HFV = 't873mpnx8x3wo464';
  LogFactor = ['Uid', 'Xos', 'Zck'];
  KeyVectorFactor = [
    'AuthCode',
    'Channel',
    'EventCode',
    'Format',
    'LogKey',
    'TenantId',
    'Token',
  ];

  constructor(
    private _httpclient: HttpClient,
    private _sessionStoreage: SessionStorageService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
  }

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */

  login(credentials: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_AUTHENTICATION;

    return this._httpclient.post<any>(url, credentials, this.httpOptions).pipe(
      tap(() => console.log(`**API REQUEST `)),
      map((x: any) => {
        const apiR: ApiResult = {
          Result: x['Result'],
          Message: x.Message,
          Status: x.Status,
        };

        if (x['Status'] && x['Result']) {
          const decryptedResult = this.DecryptResponseByAES(x['Result']);
          console.log('**API RESPONSE  :: ', decryptedResult);

          apiR.Result = decryptedResult as any;
        }

        return apiR;
      }),
      catchError(this.handleError<any>('::::::::: API ERROR STATUS ::::::::::'))
    );
  }

  /**
   * Checks is the user is authenticated.
   * @return {boolean} True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return true;
    // return !!this.credentials;
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<any> {
    const _httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }).append(
        'Token',
        this._sessionStoreage.getSessionStorage(SessionKeys.Token) == null
          ? '0xAAE559341E96993160011A8AF4A1824202F0F47FF1AF528517B2185FFA91615B6221A3E9AA24B290BA960BA14CD65C6A92D1'
          : this._sessionStoreage.getSessionStorage(SessionKeys.Token)
      ),
    };
    // Customize session storage cleared here

    // this.cookieService.getAll();
    sessionStorage.removeItem('SearchPanel');
    sessionStorage.clear();
    this._sessionStoreage.clearSessionStorage();

    const url =
      environment.environment.SECURITY_BASE_URL + api_endpoints.SECURITY_LOGOUT;
    return this._httpclient.post(url, '', _httpOptions).pipe(
      tap(() => console.log(`INSERT DONE`)),
      catchError(this.handleError<any>('INSERT ERROR'))
    );
  }

  private handlepostTokenError(error: HttpErrorResponse) {
    console.log(error);

    return throwError(() => error);
  }

  getRoleIds(): Observable<any> {
    return of('assets/config.json');
  }

  private extractData(res: Response) {
    console.log('log', res);

    const body = res;
    console.log(body, 'body');

    return body || {};
  }

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  getAuthenticationConfiguration(requestURL_params: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_ENDPOINT;
    return this._httpclient.get<any>(url + requestURL_params).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  GenerateQRCode() {
    const url =
      environment.environment.API_BASE_URL +
      api_endpoints.SECURITY_GENERATESECRETKEY;
    console.log('url ', url);
    return this._httpclient.post<any>(url, '', this.httpOptions).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  VerifyCode(code: any) {
    const url =
      environment.environment.API_BASE_URL + api_endpoints.SECURITY_VERIFYCODE;
    console.log('url ', url);
    return this._httpclient
      .post<any>(url, JSON.stringify(code), this.httpOptions)
      .pipe(
        map((res) => res),
        catchError(this.handlepostTokenError)
      );
  }

  // HTTP GET
  getAuthConfigDataByCompanyAndClient(requestURL_params: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_COMPANYANDCLIENT_ENDPOINT;
    return this._httpclient.get<any>(url + requestURL_params).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  // HTTP GET
  getUserOTP(requestURL_params: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_REQUESTOTP;
    return this._httpclient.get<any>(url + requestURL_params).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  // HTTP POST
  validateOTP(data: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_VALIDATEOTP;
    return this._httpclient.post<any>(url, data, this.httpOptions).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  //HTTP POST
  updatePassword(data: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_UPDATEPASSWORD;
    return this._httpclient.post<any>(url, data, this.httpOptions).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }
  //HTTP POST
  changePassword(data: any): Observable<any> {
    this.httpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }).append(
        'Token',
        this._sessionStoreage.getSessionStorage(SessionKeys.Token)
      ),
    };
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_CHANGEPASSWORD;
    return this._httpclient.post<any>(url, data, this.httpOptions2).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  SendOTPForMFA(): Observable<any> {
    this.httpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }).append(
        'Token',
        this._sessionStoreage.getSessionStorage(SessionKeys.Token)
      ),
    };
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_SENDOTPFORMFA;
    return this._httpclient.post<any>(url, '', this.httpOptions2).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  GetQRCodeForMFA(OTP: number): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_GENERATEQRCODEFORMFA;
    return this._httpclient.get<any>(url + OTP, this.httpOptions2).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  EnableMFA(data: any): Observable<any> {
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_ENABLEMFA;
    return this._httpclient.post<any>(url, data, this.httpOptions2).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }
  DisableMFA(data: any): Observable<any> {
    this.httpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }).append(
        'Token',
        this._sessionStoreage.getSessionStorage(SessionKeys.Token)
      ),
    };
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_DISABLEMFA;
    return this._httpclient.post<any>(url, data, this.httpOptions2).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  VerifyMFA(TFACode: any): Observable<any> {
    this.httpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }).append(
        'Token',
        this._sessionStoreage.getSessionStorage(SessionKeys.Token)
      ),
    };
    const req_pay = `${TFACode}`;
    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_VERIFYMFA;
    return this._httpclient.get<any>(url + req_pay, this.httpOptions2).pipe(
      tap(() => console.log(`**API REQUEST `)),
      map((x: any) => {
        const apiR: ApiResult = {
          Result: x['Result'],
          Message: x.Message,
          Status: x.Status,
        };

        if (x['Status'] && x['Result']) {
          const decryptedResult = this.DecryptResponseByAES(x['Result']);
          console.log('**API RESPONSE  :: ', decryptedResult);

          apiR.Result = decryptedResult as any;
        }

        return apiR;
      }),
      catchError(this.handleError<any>('::::::::: API ERROR STATUS ::::::::::'))
    );
  }

  // HTTP PUT

  // candidateLogin(credentials: any): Observable<any> {

  //   const url = environment.environment.SECURITY_BASE_URL + api_endpoints.CANDIDATE_LOGIN;
  //   return this._httpclient.put<any>(url + credentials, this.httpOptions)
  //     .pipe(map(res => res),
  //       catchError(this.handlepostTokenError));

  // }

  google_signOut(): void {
    // this.googleService.signOut();
  }

  google_signIn(): void { }

  public getJSON(): Observable<any> {
    return this._httpclient.get('assets/json/config.json').pipe(
      map((res) => res, this.extractData),
      catchError(this.handleError<any>('update error'))
    );
  }

  getRequestHeader() {
    this.tokenHttpOptions = {
      headers: new HttpHeaders({
        accept: 'application/json',
        'Content-Type': 'application/json',
      }).append(
        'Token',
        this._sessionStoreage.getSessionStorage(SessionKeys.Token) == null
          ? '0xAAE559341E96993160011A8AF4A1824202F0F47FF1AF528517B2185FFA91615B6221A3E9AA24B290BA960BA14CD65C6A92D1'
          : this._sessionStoreage.getSessionStorage(SessionKeys.Token)
      ),
    };
  }
  public UpdateRoleInSession(role: any): Observable<any> {
    this.getRequestHeader();

    const url =
      environment.environment.SECURITY_BASE_URL +
      api_endpoints.SECURITY_UPDATEROLEINSESSION;
    return this._httpclient.put<any>(url, role, this.tokenHttpOptions).pipe(
      map((res) => res),
      catchError(this.handlepostTokenError)
    );
  }

  public EncryptResponseByAES(strToEncrypt: string) {
    const key = CryptoJS.enc.Utf8.parse(this.HFK);
    const vector = CryptoJS.enc.Utf8.parse(this.HFV);

    let encrypted;

    try {
      encrypted = CryptoJS.AES.encrypt(strToEncrypt, key, {
        keySize: 128,
        iv: vector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    }
    catch (ex) {
      encrypted = null;
    }

    let encryptedString: string = encrypted?.toString() ?? "";

    let reForPlus = /\+/g;
    let reForSlash = /\//g;
    let charReplacedEncryptedString: string = encryptedString.replace(reForPlus, "*").replace(reForSlash, "-");

    return charReplacedEncryptedString;
  }

  public DecryptResponseByAES(strToDecrypt: string) {
    const reForPlus = /\*/g;
    const reForSlash = /\-/g;
    const charReplacedStringToDecrypt: string = strToDecrypt
      .replace(reForPlus, '+')
      .replace(reForSlash, '/');

    const key = CryptoJS.enc.Utf8.parse(this.HFK);
    const vector = CryptoJS.enc.Utf8.parse(this.HFV);
    let decrypted: any;

    try {
      decrypted = CryptoJS.AES.decrypt(charReplacedStringToDecrypt, key, {
        keySize: 128 / 8,
        iv: vector,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
    } catch (ex) {
      decrypted = null;
      console.log(ex);
    }
    return this.EncryptDecryptHelper(
      JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
    );
  }

  EncryptDecryptHelper(verificationLog: VerificatinLogs) {
    if (verificationLog != null) {
      const decodedRanIdString: any = atob(
        verificationLog.VisitorRandId.toString()
      );

      const KeyVectorElementName: any = this.LogFactor[decodedRanIdString];
      const decodedLogFactorString = atob(
        verificationLog[
          KeyVectorElementName as keyof VerificatinLogs
        ].toString()
      );

      const digits = decodedLogFactorString.toString().split('').map(Number);
      const KeyElementName = this.KeyVectorFactor[digits[0]];
      const VectorElementName = this.KeyVectorFactor[digits[1]];

      const KeyElementValue: any =
        verificationLog[KeyElementName as keyof VerificatinLogs];
      const VectorElementValue: any =
        verificationLog[VectorElementName as keyof VerificatinLogs];

      const decryptedText = this.DecryptHelper(
        KeyElementValue,
        VectorElementValue,
        verificationLog.MfiLog
      );
      console.log('decryptedText ::', decryptedText);
      return decryptedText;
    }
  }

  DecryptHelper(key: string, vector: string, stringValue: string) {
    console.log('entered ');

    const myStr = stringValue.replace(/"/g, '');

    const reForPlus = /\*/g;
    const reForSlash = /\-/g;
    const charReplacedStringToDecrypt: string = myStr
      .replace(reForPlus, '+')
      .replace(reForSlash, '/');

    const parsedkey = CryptoJS.enc.Latin1.parse(key);
    const parsedIV = CryptoJS.enc.Latin1.parse(vector);

    let decrypted: any;
    try {
      decrypted = CryptoJS.AES.decrypt(charReplacedStringToDecrypt, parsedkey, {
        keySize: 128 / 8,
        iv: parsedIV,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString(CryptoJS.enc.Utf8);
    } catch (ex) {
      decrypted = null;
    }

    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
  }

  postWithoutSecurity(API_ENDPOINTS: string, data: any): Observable<any> {
    this.getRequestHeader();
    // return this._httpclient.post<any>(this.API_URL + API_ENDPOINTS, data, this.httpOptions)
    //   .pipe(map(res => res),
    //     catchError(this.handlepostTokenError));

    return this._httpclient.post(environment.environment.API_BASE_URL + API_ENDPOINTS, data, this.httpOptions).pipe(
      tap(_ => console.log(`INSERT DONE`)),
      catchError(this.handleError<any>('INSERT ERROR'))
    );
  }

  get sessionDetails() {
    return JSON.parse(this._sessionStoreage.getSessionStorage(SessionKeys.LoginResponses));
  }

  handleErrors(error: any) {

    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(errorMessage);
  }

  put_text(API_ENDPOINTS: any, data: any): Observable<any> {
    this.getRequestHeader();


    if (environment.environment.EncryptRequest) {
      let url = new URL(environment.environment.API_BASE_URL + API_ENDPOINTS + data);

      console.log("URL HEADER ::", url);

      //#region Get New Path Name
      let pathNames = url.pathname.split('/');

      let apiEndpoints = pathNames.slice(1, 5);

      let params = pathNames.slice(5);

      console.log("pathnames ::", pathNames, apiEndpoints, params);

      let encryptedParams: string[] = [];

      for (let param of params) {
        let encryptedParam = this.EncryptResponseByAES(param);
        // encryptedParam = encryptedParam.replace('/' , '*').replace('+' , '-').replace('=' , '_');
        encryptedParams.push(encryptedParam);
      }

      let newPathName: string = apiEndpoints.join('/');
      newPathName += (encryptedParams.length > 0) ? ("/" + encryptedParams.join('/')) : "";

      //#endregion

      //#region Get New Search

      let oldSearchParams = url.searchParams;

      let newSearchParams: URLSearchParams = new URLSearchParams();

      oldSearchParams.forEach((value, key) => {
        newSearchParams.append(key, this.EncryptResponseByAES(value));
      })

      let newSearch = newSearchParams.toString();

      //#endregion

      var newURL = url.protocol + "//" + url.host + "/" + newPathName;
      newURL += (newSearch !== undefined && newSearch !== null && newSearch !== '') ? ("?" + newSearch) : "";

      console.log("New Get URl", newURL);

      let cipherText = this.EncryptResponseByAES(JSON.stringify(""));

      if (cipherText == null) {
        return of(null);
      }

      return this._httpclient.put<any>(newURL, cipherText, this.httpOptions)
        .pipe(
          tap(_ => console.log(`FETCH DONE`)),
          map((x: any) => {
            console.log('GET API NETWORK RESPONSE :: ', this.DecryptResponseByAES(x));
            if (environment.environment?.DecryptResponse === true) {
              return this.DecryptResponseByAES(x)
            }
            else {
              return x;
            }
          }),
          catchError(this.handleErrors)
        );
    }
    else {
      return this._httpclient.put<any>(environment.environment.API_BASE_URL + API_ENDPOINTS + data, "", this.httpOptions)
        .pipe(
          tap(_ => console.log(`FETCH DONE`)),
          map((x: any) => {
            console.log('GET API NETWORK RESPONSE :: ', this.DecryptResponseByAES(x));
            if (environment.environment?.DecryptResponse) {
              return this.DecryptResponseByAES(x)
            }
            else {
              return x;
            }
          }),
          catchError(this.handleErrors)
        );
    }

    // return this._httpclient.put(this.API_URL + API_ENDPOINTS + data, "", this.httpOptions).pipe(
    //   tap(_ => console.log(`UPDATE DONE`)),
    //   catchError(this.handleError<any>('UPDATE ERROR'))
    // );
  }

  postForObjectStorage(API_ENDPOINTS: any, data: any): Observable<any> {

    this.getRequestHeader();


    if (environment.environment?.EncryptRequest) {

      let url = new URL(environment.environment.OBJECTSTORAGE_BASE_URL + API_ENDPOINTS);



      //#region Get New Path Name
      let pathNames = url.pathname.split('/');

      let apiEndpoints = pathNames.slice(1, 5);

      let params = pathNames.slice(5);


      let encryptedParams: string[] = [];

      for (let param of params) {
        let encryptedParam = this.EncryptResponseByAES(param);
        // encryptedParam = encryptedParam.replace('/' , '*').replace('+' , '-').replace('=' , '_');
        encryptedParams.push(encryptedParam);
      }

      let newPathName: string = apiEndpoints.join('/');
      newPathName += (encryptedParams.length > 0) ? ("/" + encryptedParams.join('/')) : "";

      //#endregion

      //#region Get New Search

      let oldSearchParams = url.searchParams;

      let newSearchParams: URLSearchParams = new URLSearchParams();

      oldSearchParams.forEach((value, key) => {
        newSearchParams.append(key, this.EncryptResponseByAES(value));
      })

      let newSearch = newSearchParams.toString();

      //#endregion

      var newURL = url.protocol + "//" + url.host + "/" + newPathName;
      newURL += (newSearch !== undefined && newSearch !== null && newSearch !== '') ? ("?" + newSearch) : "";

      let cipherText = this.EncryptResponseByAES(JSON.stringify(data));

      if (cipherText == null) {
        return of(null);
      }

      console.log('newURL :: ', newURL);

      console.log('data :: ', data);
      console.log('cipherText :: ', cipherText);

      return this._httpclient.post<any>(newURL, cipherText, this.httpOptions).pipe(
        tap(_ => console.log(`INSERT DONE`)),
        map((x: any) => {
          // console.log('POST API NETWORK RESPONSE :: ', this.encryptDecryptService.DecryptWithAES(this.sessionDetails, x));
          // if (environment.environment.DecryptResponse !== undefined && environment.environment.DecryptResponse !== null &&
          //   environment.environment.DecryptResponse === true) {
          //   this.callbackSubscribe(this.encryptDecryptService.DecryptWithAES(this.sessionDetails, x));
          //   return this.encryptDecryptService.DecryptWithAES(this.sessionDetails, x)
          // }
          // else {
          return x;
          // }
        }),
        catchError(this.handleError<any>('INSERT ERROR'))
      );
    }
    else {
      return this._httpclient.post(environment.environment.API_BASE_URL + API_ENDPOINTS, data, this.httpOptions).pipe(
        tap(_ => console.log(`INSERT DONE`)),
        map((x: any) => {
          console.log('POST API NETWORK RESPONSE :: ', this.DecryptResponseByAES(x));

          if (environment.environment?.DecryptResponse) {
            return this.DecryptResponseByAES(x)
          }
          else {
            return x;
          }
        }),
        catchError(this.handleError<any>('INSERT ERROR'))
      );
    }

  }

  post(API_ENDPOINTS: any, data: any): Observable<any> {

    this.getRequestHeader();
    if (environment.environment?.EncryptRequest) {
      let url = new URL(environment.environment.API_BASE_URL + API_ENDPOINTS);


      //#region Get New Path Name
      let pathNames = url.pathname.split('/');

      let apiEndpoints = pathNames.slice(1, 5);

      let params = pathNames.slice(5);


      let encryptedParams: string[] = [];

      for (let param of params) {
        let encryptedParam = this.EncryptResponseByAES(param);
        // encryptedParam = encryptedParam.replace('/' , '*').replace('+' , '-').replace('=' , '_');
        encryptedParams.push(encryptedParam);
      }

      let newPathName: string = apiEndpoints.join('/');
      newPathName += (encryptedParams.length > 0) ? ("/" + encryptedParams.join('/')) : "";

      //#endregion

      //#region Get New Search

      let oldSearchParams = url.searchParams;

      let newSearchParams: URLSearchParams = new URLSearchParams();

      oldSearchParams.forEach((value, key) => {
        newSearchParams.append(key, this.EncryptResponseByAES(value));
      })

      let newSearch = newSearchParams.toString();

      //#endregion

      var newURL = url.protocol + "//" + url.host + "/" + newPathName;
      newURL += (newSearch !== undefined && newSearch !== null && newSearch !== '') ? ("?" + newSearch) : "";

      let cipherText = this.EncryptResponseByAES(JSON.stringify(data));

      if (cipherText == null) {
        return of(null);
      }

      return this._httpclient.post<any>(newURL, cipherText, this.httpOptions).pipe(
        tap(_ => console.log(`INSERT DONE`)),
        map((x: any) => {
          console.log('POST API NETWORK RESPONSE :: ', this.DecryptResponseByAES(x));
          if (environment.environment?.DecryptResponse) {
            this.callbackSubscribe(this.DecryptResponseByAES(x));
            return this.DecryptResponseByAES(x)
          }
          else {
            return x;
          }
        }),
        catchError(this.handleError<any>('INSERT ERROR'))
      );
    }
    else {
      return this._httpclient.post(environment.environment.API_BASE_URL + API_ENDPOINTS, data, this.httpOptions).pipe(
        tap(_ => console.log(`INSERT DONE`)),
        map((x: any) => {
          console.log('POST API NETWORK RESPONSE :: ', this.DecryptResponseByAES(x));

          if (environment.environment?.DecryptResponse === true) {
            return this.DecryptResponseByAES(x)
          }
          else {
            return x;
          }
        }),
        catchError(this.handleError<any>('INSERT ERROR'))
      );
    }

  }

  private callbackSubscribe(jsonPreview: any) {

    interface apiResponse {

      Error: string;
      InsertedId: number;
      Message: string;
      RowsAffected: number;
      Status: boolean;
      dynamicObject: null;

    }
    interface ApiResult {

      Result: string;
      Message: string;
      Status: boolean;
    }


    function instanceOfDynamicObject(object: any): object is apiResponse {
      return 'dynamicObject' in object;
    }

    function instanceOfResult(object: any): object is ApiResult {
      return 'Result' in object;
    }

    var a: any = { Error: '', InsertedId: 0, Message: '', RowsAffected: 0, Status: false, dynamicObject: null };
    var b: any = { Result: '', Message: '', Status: false };

    if (instanceOfDynamicObject(a)) {
      console.log('result of sc', jsonPreview);
    } else if (instanceOfResult(b)) {
      console.log('result of sc', jsonPreview);
    } else {

    }


  }

}
