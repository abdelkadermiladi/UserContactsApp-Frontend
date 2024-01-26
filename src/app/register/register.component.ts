import { Component } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  age: number = 0;
  gender: string = '';
  email: string = '';
  phone_number!: number;

  constructor(private authService: AuthService) {}

  register(): void {
    const userDetails = {
      username: this.username,
      password: this.password,
      age: this.age,
      gender: this.gender,
      email: this.email,
      phone_number: this.phone_number
    };
  
    this.authService.register(userDetails).subscribe(
      response => {
        // Handle successful registration
        console.log('Registration successful');
        alert('Registration successful. You can now log in.'); // Add alert for success
      },
      error => {
        // Handle registration failure
        console.error('Registration failed', error);
        if (error.status === 400 && error.error.message === 'Username already exists') {
          alert('Username already exists. Please choose a different username.');
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    );
  }
  
}
