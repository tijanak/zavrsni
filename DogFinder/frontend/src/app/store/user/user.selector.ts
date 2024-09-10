import { createSelector } from '@ngrx/store';
import { AppState } from '../app.reducer';

export const selectUserFeature = createSelector(
  (state: AppState) => state.user,
  (user) => user
);

export const selectProfile = createSelector(
  selectUserFeature,
  (user) => user.profile
);
export const selectUserError = createSelector(
  selectUserFeature,
  (user) => user.error
);
