import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { ContentListComponent } from './components/content/content-list.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/content', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  {
    path: 'content',
    component: ContentListComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
