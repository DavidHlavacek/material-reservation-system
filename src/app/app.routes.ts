import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home-view/home-view.component';
import { ItemsComponent } from './components/items-view/items-view.component';
import { LoginComponent } from './components/login-view/login-view.component';
import { CreateItemViewComponent } from './components/create-item-view/create-item-view.component';
import { BarcodeGeneratorComponent } from './components/barcode-generator/barcode-generator.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { CategoriesViewComponent } from './components/categories-view/categories-view.component';
import { CreateCategoryViewComponent } from './components/create-category-view/create-category-view.component';
import { ScanBarcodeComponent } from './components/scan-barcode/scan-barcode.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'registration',
        component: RegistrationComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      
      { path: '', component: ScanBarcodeComponent },
      {
        path: 'items',
        children: [
          { path: '', redirectTo: 'show-items', pathMatch: 'full' },
          { path: 'show-items', component: ItemsComponent },
          { path: 'create-item', component: CreateItemViewComponent },
        ],
      },
      {
        path: 'categories',
        children: [
          { path: '', redirectTo: 'show-categories', pathMatch: 'full' },
          { path: 'show-categories', component: CategoriesViewComponent },
          { path: 'create-category', component: CreateCategoryViewComponent },
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
