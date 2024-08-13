// src/app/dialog/dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [],
})
export class DialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; content: string },
    public dialogRef: MatDialogRef<DialogComponent>
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
