import { ActionReducerMap } from '@ngrx/store';
import { authReducer, AuthState } from './auth/auth.reducer';
import {
  routerReducer,
  RouterReducerState,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { userReducer, UserState } from './user/user.reducer';
import { imageReducer, ImageState } from './images/images.reducer';
import { postReducer, PostState } from './post/post.reducer';
export interface AppState {
  auth: AuthState;
  router: RouterReducerState<SerializedRouterStateSnapshot>;
  image: ImageState;
  user: UserState;
  post: PostState;
}

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  router: routerReducer,
  user: userReducer,
  image: imageReducer,
  post: postReducer,
};
