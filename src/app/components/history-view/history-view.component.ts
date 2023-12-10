import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilteringOptionsComponent } from './filtering-options/filtering-options.component';
import { HistoryListComponent } from './history-list/history-list.component';
@Component({
  selector: 'app-history-view',
  standalone: true,
  imports: [CommonModule, FilteringOptionsComponent, HistoryListComponent],
  templateUrl: './history-view.component.html',
  styleUrl: './history-view.component.css'
})
export class HistoryViewComponent {

}
