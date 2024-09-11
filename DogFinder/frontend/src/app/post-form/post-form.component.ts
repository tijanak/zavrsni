import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { maxImageAmount } from '../validators/max-image-amount-validator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent {
  postForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PostFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { looking_for: boolean }
  ) {
    this.postForm = this.fb.group({
      title: [' ', Validators.required],
      body: [' ', Validators.required],
      looking_for: [this.data.looking_for],
      images: [FileList, maxImageAmount(10)],
    });
  }
  onFileChange(event: any) {
    const fileInput = event.target;
    if (fileInput.files) {
      this.postForm.patchValue({
        images: fileInput.files,
      });
    }
  }
  onSubmit(): void {
    if (this.postForm.valid) {
      let formData = { ...this.postForm.value };
      this.dialogRef.close(formData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
