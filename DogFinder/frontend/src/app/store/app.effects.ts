import { AuthEffects } from './auth/auth.effects';
import { RouteEffects } from './routing/routing.effects';

export const appEffects = [RouteEffects, AuthEffects];
