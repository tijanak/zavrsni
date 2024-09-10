import { createSelector } from '@ngrx/store';
import { imageAdapter } from './images.reducer';
import { AppState } from '../app.reducer';
import { IImage } from '@dog-finder/models';

const { selectEntities, selectAll } = imageAdapter.getSelectors();
export const selectImageFeature = createSelector(
  (state: AppState) => state.image,
  (state) => state
);
export const selectImages = createSelector(selectImageFeature, selectAll);

export const selectImagesForPost = (postId: number) =>
  createSelector(selectImages, (images: IImage[]) =>
    images.filter((image) => image.post.id === postId)
  );
export const selectImageError = createSelector(
  selectImageFeature,
  (imageState) => imageState.error
);
