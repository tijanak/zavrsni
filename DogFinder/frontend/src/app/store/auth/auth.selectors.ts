import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';

export const selectAuthFeature = createSelector(
  (state: AppState) => state.auth,
  (auth) => auth
);

export const selectAuthError = createSelector(
  selectAuthFeature,
  (auth) => auth.error
);
