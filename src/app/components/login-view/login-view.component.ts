import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LoginService } from '../../services/login.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, HttpClientModule],
  providers: [LoginService],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css',
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {}

  login() {
    this.loginService.login(this.email, this.password)
      .subscribe(
        (response: any) => {
          this.loginError = false;
          console.log(response);
          this.router.navigate(['/']);
          // Successful login, handle the response as needed
          // You can navigate to a new page using Angular Router
        },
        (error) => {
          // Error handling, show an error message
          this.loginError = true;
          console.log(error);
        }
      );
  }
}
