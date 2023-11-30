import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home-view/home-view.component';
import { ItemsComponent } from './components/items-view/items-view.component';
import { LoginComponent } from './components/login-view/login-view.component';
export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'items', component: ItemsComponent },
      // Add more routes as needed
      { path: '**', redirectTo: 'home' }, // Default route within the layout
    ],
  },
];
