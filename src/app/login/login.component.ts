import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService,private router: Router) {}

  
  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        // Check the 'message' property in the response JSON
        if (response.message === 'Login successful') {
          console.log('Login successful');
  
          // Navigate to the welcome page and pass the username as a query parameter
          this.router.navigate(['/welcome'], { queryParams: { username: this.username } });
        } 
      },
      error => {
        console.error('Login failed', error);
        if (error.status === 401) {
          // Display a custom error message to the user
          alert('No user with such credentials. Please try again.');
        }
      }
    );
  }
}