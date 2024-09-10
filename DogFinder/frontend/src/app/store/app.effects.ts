import { AuthEffects } from './auth/auth.effects';
import { ImageEffects } from './images/images.effects';
import { PostEffects } from './post/post.effects';
import { RouteEffects } from './routing/routing.effects';
import { UserEffects } from './user/user.effects';

export const appEffects = [
  RouteEffects,
  AuthEffects,
  ImageEffects,
  UserEffects,
  PostEffects,
];
