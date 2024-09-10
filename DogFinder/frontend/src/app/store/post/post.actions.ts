import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { CreatePostDto, IPost } from '@dog-finder/models';

export const loadPosts = createAction('[Posts] Load Posts');

export const loadPostsSuccess = createAction(
  '[Posts] Load Posts Success',
  props<{ posts: IPost[] }>()
);

export const loadPostsFailure = createAction(
  '[Posts] Load Posts Failure',
  props<{ error: HttpErrorResponse }>()
);
export const loadPost = createAction(
  '[Posts] Load Post',
  props<{ id: number }>()
);

export const loadPostSuccess = createAction(
  '[Posts] Load Post Success',
  props<{ post: IPost }>()
);

export const loadPostFailure = createAction(
  '[Posts] Load Post Failure',
  props<{ error: HttpErrorResponse }>()
);
export const loadPostMatches = createAction(
  '[Posts] Load Post Matches',
  props<{ id: number }>()
);

export const loadPostMatchesSuccess = createAction(
  '[Posts] Load Post Matches Success',
  props<{ matches: IPost[] }>()
);

export const loadPostMatchesFailure = createAction(
  '[Posts] Load Post Matches Failure',
  props<{ error: HttpErrorResponse }>()
);
export const uploadPost = createAction(
  '[Posts] Upload Post',
  props<{ postDto: CreatePostDto; images: FileList }>()
);

export const uploadPostSuccess = createAction(
  '[Posts] Upload Post Success',
  props<{ post: IPost }>()
);

export const uploadPostFailure = createAction(
  '[Posts] Upload Post Failure',
  props<{ error: HttpErrorResponse }>()
);
