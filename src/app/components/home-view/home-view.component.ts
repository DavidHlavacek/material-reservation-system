import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorrowerProcessComponent } from './borrower-process/borrower-process.component';
import { ItemProcessComponent } from './item-process/item-process.component';
@Component({
  selector: 'app-home-view',
  standalone: true,
  imports: [CommonModule, BorrowerProcessComponent, ItemProcessComponent],
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.css',
})
export class HomeComponent {}
