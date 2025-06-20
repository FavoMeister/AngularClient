import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Car } from '../../services/cars/car';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardContent, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-car-edit',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatCardContent,
    MatButtonModule,
    MatFormField,
    MatLabel,
    MatError,
    MatOption,
    CommonModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './car-edit.html',
  styleUrl: './car-edit.css'
})
export class CarEdit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private carService = inject(Car);
  private snackBar = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  carForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    //price: ['', [Validators.required, Validators.min(0)]],
    price: [0, [Validators.required, Validators.min(0)]],
    status: [true, Validators.required],
    image: [null as File | null]
  });

  carId!: number;
  currentImageUrl?: string;

  ngOnInit() {
    this.carId = this.route.snapshot.params['id'];
    this.loadCarData();
  }

  loadCarData() {
    this.carService.getCarForEdit(this.carId).subscribe({
      next: (response) => {
        this.carForm.patchValue({
          title: response.data.car.title,
          description: response.data.car.description,
          price: response.data.car.price,
          status: response.data.car.status
        });
        this.currentImageUrl = response.data.car.image || undefined;
      },
      error: () => this.router.navigate(['/not-found'])
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.carForm.patchValue({ image: input.files[0] });
      this.carForm.get('image')?.updateValueAndValidity();
    }
  }

  onSubmit() {
    if (this.carForm.invalid) return;

    const formData = new FormData();
    const formValue = this.carForm.getRawValue();
    console.log('Valores del formulario:', formValue);
    formData.append('title', formValue.title!);
    formData.append('description', formValue.description!);
    formData.append('price', formValue.price!.toString());
    formData.append('status', formValue.status!.toString());
    
    if (this.carForm.value.image) {
      formData.append('image', this.carForm.value.image);
    }
    formData.forEach((value, key) => {
      console.log(key, value);
    });
    
    this.carService.updateCar(this.carId, formData).subscribe({
      next: () => {
        this.snackBar.open('Auto actualizado con éxito', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/cars', this.carId]);
      },
      error: (error) => {
        this.snackBar.open('Error al actualizar: ' + error.message, 'Cerrar', { duration: 5000 });
      }
    });
  }
}
