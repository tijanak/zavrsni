import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { IImage } from '@dog-finder/models';

export const uploadImages = createAction(
  '[Images] Upload',
  props<{ images: FileList; postId: number }>()
);
export const uploadImagesSuccess = createAction(
  '[Images] Upload Success',
  props<{ images: IImage[] }>()
);

export const uploadImagesFailure = createAction(
  '[Images] Upload Failure',
  props<{ error: HttpErrorResponse }>()
);
export const loadImagesForPost = createAction(
  '[Image] Load Images For Post',
  props<{ postId: number }>()
);

export const loadImagesForPostSuccess = createAction(
  '[Image] Load Images For Post Success',
  props<{ images: IImage[] }>()
);

export const loadImagesForPostFailure = createAction(
  '[Image] Load Images For Post Failure',
  props<{ error: HttpErrorResponse }>()
);
export const deleteImage = createAction(
  '[Image] Delete Image',
  props<{ id: number }>()
);

export const deleteImageSuccess = createAction(
  '[Image] Delete Image Success',
  props<{ id: number }>()
);

export const deleteImageFailure = createAction(
  '[Image] Delete Image Failure',
  props<{ error: HttpErrorResponse }>()
);
