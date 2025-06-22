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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../shared/confirmation-dialog/confirmation-dialog';

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
  private snackBar = inject(MatSnackBar); // Inyecta SnackBar
  private dialog = inject(MatDialog);
  
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
  changeStatus(car: CarModel) {
    const newStatus = !car.status;
    
    this.carService.updateCarStatus(car.id, newStatus).subscribe({
      next: (updatedCar) => {
        car.status = updatedCar.status;
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Error al actualizar', 'Cerrar', { duration: 3000 });
      }
    });
  }

  deleteCar(carId: number) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: '¿Estás seguro de eliminar este auto?'
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.carService.deleteCar(carId).subscribe({
          next: () => {
            this.cars = this.cars.filter(c => c.id !== carId);
            this.snackBar.open('Auto eliminado', 'Cerrar', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Error al eliminar', 'Cerrar', { duration: 3000 });
          }
        });
      }
    });
  }
}
