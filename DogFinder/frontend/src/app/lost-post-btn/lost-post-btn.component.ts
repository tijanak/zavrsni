import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PostFormComponent } from '../post-form/post-form.component';
import { MatButtonModule } from '@angular/material/button';
import { AppState } from '../store/app.reducer';
import { Store } from '@ngrx/store';
import { uploadPost } from '../store/post/post.actions';

@Component({
  selector: 'app-lost-post-btn',
  standalone: true,
  imports: [CommonModule, PostFormComponent, MatButtonModule],
  templateUrl: './lost-post-btn.component.html',
  styleUrl: './lost-post-btn.component.css',
})
export class LostPostBtnComponent {
  constructor(private dialog: MatDialog, private store: Store<AppState>) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(PostFormComponent, {
      width: '400px',
      data: { looking_for: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          uploadPost({
            postDto: {
              description: result.description,
              looking_for: result.looking_for,
            },
            images: { ...result.images, length: result.images.length },
          })
        );
      }
    });
  }
}
