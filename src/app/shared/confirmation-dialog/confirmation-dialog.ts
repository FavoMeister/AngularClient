import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.css'
})
export class ConfirmationDialog {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialogRef: MatDialogRef<ConfirmationDialog>
  ) {}
}
