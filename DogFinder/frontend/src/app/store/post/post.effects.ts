import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import {
  deletePost,
  deletePostFailure,
  deletePostSuccess,
  loadPost,
  loadPostFailure,
  loadPostMatchesFailure,
  loadPostMatchesSuccess,
  loadPosts,
  loadPostsFailure,
  loadPostsSuccess,
  loadPostSuccess,
  uploadPost,
  uploadPostFailure,
  uploadPostSuccess,
} from './post.actions';
import { PostService } from '../../services/post.service';
import { loadImagesForPost, uploadImages } from '../images/images.actions';
import { DognnService } from '../../services/nn.service';
import { CreatePostDto } from '@dog-finder/models';

@Injectable()
export class PostEffects {
  constructor(
    private actions$: Actions,
    private postService: PostService,
    private nnService: DognnService
  ) {}
  loadPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPosts),
      switchMap(() =>
        this.postService.findAll().pipe(
          map((posts) => loadPostsSuccess({ posts })),
          catchError((error) => of(loadPostsFailure({ error })))
        )
      )
    )
  );
  postLoad$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPost),
      switchMap(({ id }) =>
        this.postService.findOne(id).pipe(
          map((post) => {
            return loadPostSuccess({ post });
          }),
          catchError((error) => of(loadPostFailure({ error })))
        )
      )
    )
  );
  postUpload$ = createEffect(() =>
    this.actions$.pipe(
      ofType(uploadPost),
      switchMap(({ postDto, images }) => {
        return this.postService.create(postDto).pipe(
          mergeMap((post) => [
            uploadPostSuccess({ post }),
            uploadImages({ images, postId: post.id }),
          ]),
          catchError((error) => {
            return of(uploadPostFailure({ error }));
          })
        );
      })
    )
  );
  postLoadMatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPost),
      switchMap(({ id }) =>
        this.nnService.getMatchingPosts(id).pipe(
          map((matches) => loadPostMatchesSuccess({ matches })),
          catchError((error) => of(loadPostMatchesFailure({ error })))
        )
      )
    )
  );
  postLoadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPostSuccess),
      switchMap(({ post }) => [loadImagesForPost({ postId: post.id })])
    )
  );
  postsLoadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPostsSuccess),
      switchMap(({ posts }) =>
        from(posts).pipe(
          mergeMap((post) => [loadImagesForPost({ postId: post.id })])
        )
      )
    )
  );
  postMatchesLoadSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPostMatchesSuccess),
      switchMap(({ matches }) =>
        from(matches).pipe(
          mergeMap((post) => [loadImagesForPost({ postId: post.id })])
        )
      )
    )
  );
  postDelete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deletePost),
      switchMap(({ id }) =>
        this.postService.remove(id).pipe(
          map(() => deletePostSuccess({ id })),
          catchError((error) => of(deletePostFailure({ error })))
        )
      )
    )
  );
}
