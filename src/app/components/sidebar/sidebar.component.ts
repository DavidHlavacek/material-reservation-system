import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';
import {MatListModule} from '@angular/material/list';



@Component({
  selector: 'app-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css'],
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatListModule]
})
export class SidebarComponent {
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  close(reason: string) {
    console.log(`Closing sidebar due to: ${reason}`);
    this.sidenav.close();
  }
}

