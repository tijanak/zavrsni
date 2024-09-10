import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATED, RouterNavigatedAction } from '@ngrx/router-store';
import { filter, mergeMap } from 'rxjs/operators';

@Injectable()
export class RouteEffects {
  constructor(private actions$: Actions) {}

  /*navigationToAuction$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
      filter((action) =>
        /^\/auction\/\d+$/.test(action.payload.routerState.url)
      ),

      mergeMap((action) => {
        const routeParams = action.payload.routerState.root.firstChild!.params;
        console.log(routeParams);
        const id = routeParams['id'];

        return [LoadAuction({ id }), LoadBidsForAuction({ auctionId: id })];
      })
    )
  );
  navigationToHome$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
      filter((action) => action.payload.routerState.url === '/home'),

      mergeMap(() => {
        return [LoadAuctions()];
      })
    )
  );
  navigationToCertificate$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
      filter(
        (action) => action.payload.routerState.url === '/sale-certificates'
      ),

      mergeMap(() => {
        return [loadSaleCertificates()];
      })
    )
  );
  navigationToProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType<RouterNavigatedAction>(ROUTER_NAVIGATED),
      filter((action) => action.payload.routerState.url === '/profile'),

      mergeMap(() => {
        return [LoadBidsForUser(), LoadAuctionsForUser()];
      })
    )
  );*/
}
