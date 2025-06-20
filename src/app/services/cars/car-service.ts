import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarModel } from '../../cars/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cars`;

  getCars(): Observable<{ message: string, user: any, data: CarModel[] }> {
    return this.http.get<{ message: string, user: any, data: CarModel[] }>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(
      error.error?.message || 'Ocurrió un error al obtener los autos'
    ));
  }
}
