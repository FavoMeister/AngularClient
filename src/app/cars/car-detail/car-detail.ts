import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Car } from '../../services/cars/car';
import { CarModel } from '../car';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-car-detail',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CurrencyPipe,
    DatePipe,
    MatDividerModule,
    MatProgressSpinner,
    RouterLink,
    CommonModule
  ],
  templateUrl: './car-detail.html',
  styleUrl: './car-detail.css'
})
export class CarDetail {
  protected route = inject(ActivatedRoute);
  protected router = inject(Router);
  private carService = inject(Car);
  protected authService = inject(Auth);
  
  car?: CarModel;
  isLoading = true;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loadCar(id);
  }
  
  loadCar(id: number) {
    this.carService.getCarById(id).subscribe({
      next: (response) => {
        this.car = response.data;
        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/not-found']); // Opcional: Manejo de error
      }
    });
  }
}
