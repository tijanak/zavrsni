import { Route } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PublicGuard } from './guards/public.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/pages/home/home.component';
import { ViewPostComponent } from './components/pages/view-post/view-post.component';

export const appRoutes: Route[] = [
  { path: 'login', component: LoginComponent,
    canActivate: [PublicGuard]
    },
  {
    path: 'register',
    component: RegisterComponent,
   canActivate: [PublicGuard],
  },
  { path: 'home', component: HomeComponent,
        canActivate: [AuthGuard]

  },
  {
    path: 'view-post/:id',
    component: ViewPostComponent,
    canActivate: [AuthGuard],
  },
  /*{ path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },*/
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
