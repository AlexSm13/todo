import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

interface IResponse<T> {
  status: 'ok' | 'error';
  message?: T;
}

@Injectable({
  providedIn: 'root',
})
export class AbstractService {
  constructor(private http: HttpClient) {}

  protected get<T>(filter: any) {
    const url = `${environment.apiUrl}/${environment.queryParams}`;

    const params = new HttpParams().appendAll(filter);

    return this.http
      .get<IResponse<T>>(url, {
        params,
      })
      .pipe(
        map((data) => {
          return data.message;
        }),
      );
  }

  protected post<T>(path: string, data: FormData) {
    const url = `${environment.apiUrl}${path}${environment.queryParams}`;

    return this.http.post<IResponse<T>>(url, data).pipe(
      map((data) => {
        if (data.status === 'error') {
          throw new Error('error', { cause: data.message });
        } else {
          return data.message;
        }
      }),
    );
  }
}
