import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home-view/home-view.component';
import { ItemsComponent } from './components/items-view/items-view.component';
import { LoginComponent } from './components/login-view/login-view.component';
import { CreateItemViewComponent } from './components/create-item-view/create-item-view.component';
import { BarcodeGeneratorComponent } from './components/barcode-generator/barcode-generator.component';
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
      // Add more routes as needed
      { path: '**', redirectTo: '' }, // Default route within the layout
      {path: 'barcode',
        children: [
          { path: '', redirectTo: 'generate-barcode', pathMatch: 'full' },
          { path: 'barcode-generator', component: BarcodeGeneratorComponent }
        ]
      }
    ],
  },
];
