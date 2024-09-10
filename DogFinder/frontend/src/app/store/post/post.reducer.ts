import { HttpErrorResponse } from '@angular/common/http';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { IPost } from '@dog-finder/models';
import * as actions from './post.actions';

export interface PostState extends EntityState<IPost> {
  error: HttpErrorResponse | null;
  matches: IPost[];
}
export const initialState: PostState = {
  ids: [],
  entities: {},
  matches: [],
  error: null,
};
export const postAdapter: EntityAdapter<IPost> = createEntityAdapter<IPost>();

export const postReducer = createReducer(
  initialState,
  on(actions.loadPostsSuccess, (state, { posts }) => {
    return postAdapter.setAll(posts, state);
  }),
  on(actions.loadPostsFailure, (state, { error }) => {
    return { ...state, error };
  }),
  on(actions.loadPostSuccess, (state, { post }) => {
    return postAdapter.upsertOne(post, state);
  }),
  on(actions.loadPostFailure, (state, { error }) => {
    return { ...state, error };
  }),
  on(actions.loadPostMatchesSuccess, (state, { matches }) => {
    return { ...state, matches };
  }),
  on(actions.loadPostMatchesFailure, (state, { error }) => {
    return { ...state, error };
  }),
  on(actions.uploadPostFailure, (state, { error }) => {
    return { ...state, error };
  }),
  on(actions.uploadPostSuccess, (state, { post }) => {
    return postAdapter.addOne(post, state);
  })
);
