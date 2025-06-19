import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Car } from '../../services/cars/car';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register-car',
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule
  ],
  templateUrl: './register-car.html',
  styleUrl: './register-car.css'
})
export class RegisterCar {
  protected fb = inject(FormBuilder);
  // private http = inject(HttpClient);
  protected router = inject(Router);
  private carService = inject(Car);
  private snackBar = inject(MatSnackBar);

  carForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    price: ['', [Validators.required, Validators.min(0), Validators.max(1000000)]],
    status: [true, Validators.required],
    image: [null as File | null]
  });

  onSubmit() {
    if (this.carForm.invalid) return;

      const formData = new FormData();
      const formValue = this.carForm.value;
      formData.append('title', this.carForm.value.title!);
      formData.append('description', this.carForm.value.description!);
      formData.append('price', this.carForm.value.price!.toString());
      
      // Convertir a booleano explícitamente
      const status = formValue.status !== null && formValue.status !== undefined 
        ? formValue.status 
        : true; // Valor por defecto si es null/undefined
      formData.append('status', status.toString());
      
      if (this.carForm.value.image) {
        formData.append('image', this.carForm.value.image);
      }

      this.carService.registerCar(formData).subscribe({
        next: (car) => {
          this.snackBar.open('Auto registrado con éxito', 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/cars']);
        },
        error: (error) => {
          this.snackBar.open('Error al registrar auto: ' + error.message, 'Cerrar', {
            duration: 5000
          });
        }
      });
    }

    onFileSelected(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.files?.length) {
        this.carForm.patchValue({ image: input.files[0] });
      }
    }
}
