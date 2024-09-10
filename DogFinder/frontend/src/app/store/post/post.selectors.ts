import { createSelector } from '@ngrx/store';
import { postAdapter } from './post.reducer';
import { AppState } from '../app.reducer';
import { IPost } from '@dog-finder/models';
import { selectRouteParams } from '../routing/routing.selectors';

const { selectEntities, selectAll } = postAdapter.getSelectors();
export const selectPostFeature = createSelector(
  (state: AppState) => state.post,
  (state) => state
);
export const selectPosts = createSelector(selectPostFeature, selectAll);
export const selectLostPosts = createSelector(selectPosts, (posts: IPost[]) =>
  posts.filter((post) => post.looking_for)
);

export const selectFoundPosts = createSelector(selectPosts, (posts: IPost[]) =>
  posts.filter((post) => !post.looking_for)
);
export const selectPostEntities = createSelector(
  selectPostFeature,
  selectEntities
);
export const selectSelectedPost = createSelector(
  selectPostEntities,
  selectRouteParams,
  (posts, { id }) => posts[id]
);
export const selectPostMatches = createSelector(
  selectPostFeature,
  (postState) => postState.matches
);
export const selectPostError = createSelector(
  selectPostFeature,
  (postState) => postState.error
);
