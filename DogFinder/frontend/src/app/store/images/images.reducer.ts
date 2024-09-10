import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { IImage } from '@dog-finder/models';
import * as actions from './images.actions';

export interface ImageState extends EntityState<IImage> {
  error: HttpErrorResponse | null;
}
export const initialState: ImageState = {
  ids: [],
  entities: {},
  error: null,
};
export const imageAdapter: EntityAdapter<IImage> =
  createEntityAdapter<IImage>();

export const imageReducer = createReducer(
  initialState,
  on(actions.loadImagesForPostSuccess, (state, { images }) => {
    return imageAdapter.upsertMany(images, state);
  }),
  on(actions.loadImagesForPostFailure, (state, { error }) => {
    return { ...state, error };
  }),
  on(actions.deleteImageSuccess, (state, { id }) => {
    return imageAdapter.removeOne(id, state);
  }),
  on(actions.deleteImageFailure, (state, { error }) => {
    return { ...state, error };
  }),
  on(actions.uploadImagesSuccess, (state, { images }) => {
    return imageAdapter.addMany(images, state);
  }),
  on(actions.uploadImagesFailure, (state, { error }) => {
    return { ...state, error };
  })
);
