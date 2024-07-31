import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private postUrl = 'https://httpbingo.org/post';

  constructor(private http: HttpClient) {}

  postForm(formData: FormData, headers: Record<string, string>): Observable<any> {
    const postHeaders = new HttpHeaders(headers);

    return this.http
      .post<any>(this.postUrl, formData, { headers: postHeaders })
      .pipe(
        map(response => response),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error(error.message));
        })
      )
  }
}
