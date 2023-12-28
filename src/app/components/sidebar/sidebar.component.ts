import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import { CommonModule } from '@angular/common';


// @Component({
//   selector: 'sidenav-backdrop-example', <-- Give it app-name | same for below
//   templateUrl: 'sidenav-backdrop-example.html',
//   styleUrls: ['sidenav-backdrop-example.css'],
//   standalone: true,
//   imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
// })

//Corrected
@Component({
    selector: 'app-sidebar', //THIS IS THE SELECTOR AKA HOW YOU CALL IT IN HTML 
    // <app-sidebar></app-sidebar> and not <sidebar></sidebar>
    standalone: true,
    templateUrl: 'sidebar.component.html',
    styleUrl: 'sidebar.component.css',
    imports: [CommonModule, MatSidenavModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
  })

export class SidebarComponent {
  @Output() closeSidebar = new EventEmitter<void>();

  constructor(private router: Router) {}

  onCloseSidebar() {
    this.closeSidebar.emit();
  }

  navigateTo(destination: string) {
    this.router.navigate([destination]);
    this.onCloseSidebar();
  }
}
