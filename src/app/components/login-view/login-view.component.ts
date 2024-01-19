import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
})
export class LoginComponent {}
