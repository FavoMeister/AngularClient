import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import { User } from '../../models/user';
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';
import { Auth } from '../../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinner
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Registro de Usuario</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nombre</mat-label>
              <input matInput formControlName="name" required>
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                Nombre es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Apellido</mat-label>
              <input matInput formControlName="lastname" required>
              <mat-error *ngIf="registerForm.get('lastname')?.hasError('required')">
                Apellido es requerido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email es requerido
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Ingrese un email válido
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Contraseña es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Mínimo 6 caracteres
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirmar Contraseña</mat-label>
              <input matInput formControlName="confirmPassword" type="password" required>
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Confirmación es requerida
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordsNotMatch')">
                Las contraseñas no coinciden
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="full-width" [disabled]="!registerForm.valid">
              <span *ngIf="!loading">Registrarse</span>
              <mat-spinner *ngIf="loading" diameter="24"></mat-spinner>
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <span>¿Ya tienes cuenta? <a routerLink="/login">Inicia Sesión</a></span>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      padding: 1rem;
      background-color: #f5f5f5;
    }
    .register-card {
      width: 100%;
      max-width: 400px;
      padding: 2rem;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    mat-spinner {
      margin: 0 auto;
    }

    .error-snackbar {
      background-color: #f44336;
      color: white;
    }
  `]
})
export class Register {
  registerForm: FormGroup;
  public user: User;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: Auth,
    private snackBar: MatSnackBar
    
  ) {
    this.user = new User(1, "ROLE_USER", '', '', '', '');
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { passwordsNotMatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid && !this.loading) {
      this.loading = true;
      //console.log('Formulario válido', this.registerForm.value, this.user);
      // Aquí iría la lógica de registro
      const formData = this.registerForm.value;
      const newUser = new User(
        0,
        'ROLE_USER',
        formData.name,
        formData.lastName,
        formData.email,
        formData.password
      );
      this.authService.register(newUser).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.snackBar.open('Registro exitoso! Por favor inicia sesión.', 'Cerrar', {
            duration: 5000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.loading = false;
          let errorMessage = 'Error en el registro';
          
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.status === 400) {
            errorMessage = 'El email ya está registrado';
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
      // this.authService.register(this.registerForm.value).subscribe(...)
      //this.router.navigate(['/login']);
    }
  }
}
