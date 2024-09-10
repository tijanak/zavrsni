import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';
import { ImageService } from '../../services/image.service';
import {
  deleteImage,
  deleteImageFailure,
  deleteImageSuccess,
  loadImagesForPost,
  loadImagesForPostFailure,
  loadImagesForPostSuccess,
  uploadImages,
  uploadImagesFailure,
  uploadImagesSuccess,
} from './images.actions';

@Injectable()
export class ImageEffects {
  constructor(private actions$: Actions, private imageService: ImageService) {}

  upload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadImages),
      switchMap(({ images, postId }) => {
        return this.imageService.postImagesForPost(images, postId).pipe(
          map((images) => {
            return uploadImagesSuccess({ images });
          }),
          catchError((error) => {
            return of(uploadImagesFailure({ error }));
          })
        );
      })
    )
  );
  loadImagesForPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadImagesForPost),
      mergeMap((action) =>
        this.imageService.getImagesForPost(action.postId).pipe(
          map((images) => loadImagesForPostSuccess({ images })),
          catchError((error) => of(loadImagesForPostFailure({ error })))
        )
      )
    )
  );
  deleteImage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteImage),
      switchMap(({ id }) =>
        this.imageService.deleteImage(id).pipe(
          map(() => deleteImageSuccess({ id })),
          catchError((error) => of(deleteImageFailure({ error })))
        )
      )
    )
  );
}
