// import { Component, OnInit, SidebarComponent } from '@angular/core';
// ^ SidebarComponent is your own component, not from angular core

//Corrected version
import { Component, OnInit } from '@angular/core'
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-header',
//   styleUrls: ['./header.component.css'],
//   templateUrl: './header.component.html',
//   standalone: true,
//   declarations: [SidebarComponent] <-- No declarations this is a standalone component
// })

//Corrected Version
@Component({
  selector: 'app-header',
  standalone: true,
  styleUrl: './header.component.css',
  templateUrl: './header.component.html',
  imports: [CommonModule, SidebarComponent] // imports instead and providers if services
})

export class HeaderComponent implements OnInit {
  isSidebarOpen = false;

  constructor() {}

  ngOnInit(): void {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // you're not calling this anywhere
  }
}
