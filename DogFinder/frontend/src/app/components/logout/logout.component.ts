import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.reducer';
import { logout } from '../../store/auth/auth.actions';

import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule,MatIconModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css',
})
export class LogoutComponent {
  constructor(private store: Store<AppState>, private router: Router) {}

  ngOnInit(): void {}
  logout() {
    this.store.dispatch(logout());
  }
  ngOnDestroy(): void {}
}
