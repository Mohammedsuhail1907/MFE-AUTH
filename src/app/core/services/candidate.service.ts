import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SessionStorageService } from './session-storage.service';
import { environment } from '../../../environment/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { api_endpoints } from '../api_enpoints';
import { AuthenticationService } from './authentication.service';


@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  httpOptions: any;

  constructor(
    private _httpclient: HttpClient,
    private authentication: AuthenticationService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        accept: 'application/json',
        'Content-Type': 'application/json',
      }),
    };
  }

  private handlepostTokenError(error: HttpErrorResponse) {
    console.log(error);

    return throwError(() => error);
  }

  candidateLogin(credentials: any): Observable<any> {
    const url = environment.environment.SECURITY_BASE_URL + api_endpoints.CANDIDATE_LOGIN;
    return this._httpclient.put<any>(url + credentials, this.httpOptions)
      .pipe(map(res => res),
        catchError(this.handlepostTokenError));

  }

  rejectAcceptanceLetter(data:any) {
      return this.authentication.put_text(api_endpoints.PUT_ACCEPTANCEREJECTION ,data)
            .pipe(map(res => res),
        catchError(this.handlepostTokenError));
  }

  getVerificationKey(EncryptedText: string): any {
    return this.authentication.postWithoutSecurity(api_endpoints.VERIFICATION_LINK, JSON.stringify(EncryptedText)).pipe(
      map(res => res),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  getUIOfferData(data: any): Observable<any> {
    return this.authentication.put_text(api_endpoints.GET_UIOFFERDATA, data).pipe(
      map(res => res),
      catchError(err => {
        console.error(err);
        return throwError(() => err); 
      })
    );
  }

  // file upload methods 
  public getObjectById(id:any): any {
    return this.authentication.postForObjectStorage('api/ObjectStorage/GetStoredObjectById', id).pipe(
          map(res => res),
          catchError(err => {
            return throwError(() => err);
          })
      );

  }
}
