import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
  imports: [CommonModule, MatSidenavModule]
})
export class SidebarComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  close(reason: string) {
    console.log(`Closing sidebar due to: ${reason}`);
    this.sidenav.close();
  }
}

