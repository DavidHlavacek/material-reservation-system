import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home-view/home-view.component';
import { ItemsComponent } from './components/items-view/items-view.component';
import { LoginComponent } from './components/login-view/login-view.component';
import { CreateItemViewComponent } from './components/create-item-view/create-item-view.component';
import { BarcodeGeneratorComponent } from './components/barcode-generator/barcode-generator.component';
import { RegistrationComponent } from './components/registration/registration.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'items',
        children: [
          { path: '', redirectTo: 'show-items', pathMatch: 'full' },
          { path: 'show-items', component: ItemsComponent },
          { path: 'create-item', component: CreateItemViewComponent },
        ],
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        children: [
          { path: '', redirectTo: 'show-registration', pathMatch: 'full' },
          // Remove the next line if ShowRegistrationComponent is not needed
      
        ],
      },
      { path: 'barcode', redirectTo: 'barcode/barcode-generator', pathMatch: 'full' },
      {
        path: 'barcode',
        children: [
          { path: 'barcode-generator', component: BarcodeGeneratorComponent },
        ],
      },
      { path: '**', redirectTo: '' },
    ],
  },
];
