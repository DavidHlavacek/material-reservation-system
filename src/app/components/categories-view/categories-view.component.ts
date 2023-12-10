import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilteringOptionsComponent } from './filtering-options/filtering-options.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';

@Component({
  selector: 'app-categories-view',
  standalone: true,
  imports: [CommonModule, FilteringOptionsComponent, CategoriesListComponent],
  templateUrl: './categories-view.component.html',
  styleUrl: './categories-view.component.css'
})
export class CategoriesViewComponent {

}
