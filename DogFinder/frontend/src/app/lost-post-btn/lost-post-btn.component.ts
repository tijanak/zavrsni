import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PostFormComponent } from '../post-form/post-form.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-lost-post-btn',
  standalone: true,
  imports: [CommonModule, PostFormComponent, MatButtonModule],
  templateUrl: './lost-post-btn.component.html',
  styleUrl: './lost-post-btn.component.css',
})
export class LostPostBtnComponent {
  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(PostFormComponent, {
      width: '400px',
      data: { looking_for: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Post submitted:', result);
      }
    });
  }
}
