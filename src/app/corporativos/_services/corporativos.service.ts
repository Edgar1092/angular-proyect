import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable } from 'rxjs';
import { map } from "rxjs/operators";
import { isNullOrUndefined } from "util";
@Injectable({
  providedIn: 'root'
})
export class CorporativosService {

  public apiURL = environment.apiURL
  public auth_token =  'Bearer '+localStorage.getItem('tokenscloud');

  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json",
    "Authorization":this.auth_token
  });

  list(): Observable<any> {
    return this.http.get<any>(this.apiURL+'/corporativos',{headers:this.headers})
  }

  detail(id): Observable<any> {
    return this.http.get<any>(this.apiURL+'/corporativos/'+id,{headers:this.headers})
  }

  updateDetail(id,data): Observable<any> {
    return this.http.put<any>(this.apiURL+'/corporativos/'+id, data,{headers:this.headers})
  }
  addContact(data): Observable<any> {
    return this.http.post<any>(this.apiURL+'/contactos', data,{headers:this.headers})
  }
  updateContact(id,data): Observable<any> {
    return this.http.put<any>(this.apiURL+'/contactos/'+id, data,{headers:this.headers})
  }
  deleteContact(id): Observable<any> {
    return this.http.delete<any>(this.apiURL+'/contactos/'+id,{headers:this.headers})
  }


}
