import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home-view/home-view.component';
import { ItemsComponent } from './components/items-view/items-view.component';
import { LoginComponent } from './components/login-view/login-view.component';
import { RegistrationComponent } from './components/registration/registration.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'registration',
    component: RegistrationComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'items', component: ItemsComponent },
      // Add more routes as needed
      { path: '', redirectTo: 'home', pathMatch: 'full' }, // Updated default route within the layout
    ],
  },
];
