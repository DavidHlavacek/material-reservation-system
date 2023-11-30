import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilteringOptionsComponent } from './filtering-options/filtering-options.component';
import { ItemsListComponent } from './items-list/items-list.component';

@Component({
  selector: 'app-items-view',
  standalone: true,
  imports: [CommonModule, FilteringOptionsComponent, ItemsListComponent],
  templateUrl: './items-view.component.html',
  styleUrl: './items-view.component.css',
})
export class ItemsComponent {}
