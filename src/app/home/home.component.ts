import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  username: string = '';
  gender: string = '';
  age: number = 0;

  constructor(private route: ActivatedRoute, private userService: UserService) {}

  ngOnInit(): void {
    // Fetch user information from the backend based on the username
    this.username = this.route.snapshot.queryParamMap.get('username') || '';
    console.log('*****username:', this.username);


    this.userService.getUserDetails(this.username).subscribe(
      userDetails => {
        this.gender = userDetails.gender;
        this.age = userDetails.age;
      },
      error => {
        console.error('Failed to fetch user details', error);
      }
    );
  }
}