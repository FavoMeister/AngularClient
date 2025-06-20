import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CarModel } from '../../cars/car';

@Injectable({
  providedIn: 'root'
})
export class Car {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}`;

  getCars(): Observable<{ message: string, user: any, cars: CarModel[] }> {
    return this.http.get<{ message: string, user: any, cars: CarModel[] }>(`${this.apiUrl}/cars`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(() => new Error(
      error.error?.message || 'Ocurrió un error al obtener los autos'
    ));
  }

  registerCar(formData: FormData): Observable<CarModel> {
    return this.http.post<CarModel>(`${this.apiUrl}/crear-auto`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getCarById(id: number): Observable<{ message: string, data: CarModel }> {
    return this.http.get<{ message: string, data: CarModel }>(`${this.apiUrl}/cars/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}
