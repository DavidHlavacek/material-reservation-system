import { Component, OnInit } from '@angular/core'
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
  imports: [CommonModule, SidebarComponent, MatIconModule]
})

export class HeaderComponent implements OnInit {
  isSidebarOpen = false;

  constructor() {}

  ngOnInit(): void {}
}
