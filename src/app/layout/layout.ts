import { Component } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Auth } from '../services/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-layout',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule,
    RouterOutlet,
    MatListModule,
    MatFormField,
    MatAutocompleteModule,
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.css'
})
export class Layout {
  constructor(
    public authService: Auth,
    private snackBar: MatSnackBar
  ) {}

  onLogout() {
  this.authService.logout().subscribe({
    next: () => {
      // Opcional: Mostrar mensaje de éxito
      this.snackBar.open('Sesión cerrada correctamente', 'Cerrar', {
        duration: 3000
      });
    },
    error: () => {
      this.snackBar.open('Error al cerrar sesión', 'Cerrar', {
        duration: 3000
      });
    }
  });
}
}
