import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { filter, mergeMap } from 'rxjs/operators';
import { loadPost, loadPostMatches, loadPosts } from '../post/post.actions';

@Injectable()
export class RouteEffects {
  constructor(private actions$: Actions) {}

  navigationToAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
      filter((action) =>
        /^\/view-post\/\d+$/.test(action.payload.routerState.url)
      ),

      mergeMap((action) => {
        const routeParams = action.payload.routerState.root.firstChild!.params;
        console.log(routeParams);
        const id = routeParams['id'];

        return [loadPost({ id }), loadPostMatches({ id })];
      })
    )
  );
  navigationToHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
      filter((action) => action.payload.routerState.url === '/home'),

      mergeMap(() => {
        return [loadPosts()];
      })
    )
  );
}
