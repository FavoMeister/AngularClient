import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { CarModel } from '../car';
import { Car } from '../../services/cars/car';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-car-list',
  imports: [
    MatCardModule,
    MatCardContent,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatIcon,
    CurrencyPipe,
  ],
  templateUrl: './car-list.html',
  styleUrl: './car-list.css'
})
export class CarList implements OnInit{
  private carService = inject(Car);
  protected authService = inject(Auth);
  
  //constructor(private authService: Auth){}
  
  cars: CarModel[] = [];
  isLoading = true;
  error: string | null = null;

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.isLoading = true;
    this.error = null;
    
    this.carService.getCars().subscribe({
      next: (response) => {
        // console.log(response);
        this.cars = response.cars;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message || 'Error al cargar autos';
        this.isLoading = false;
      }
    });
  }
}
