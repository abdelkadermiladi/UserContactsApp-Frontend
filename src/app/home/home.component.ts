import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../model.user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  
})
export class HomeComponent implements OnInit {
  username: string = '';
  gender: string = '';
  age: number = 0;
  otherUsersNames: string[] = [];
  selectedUser: User | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Fetch user information from the backend based on the username
    this.username = this.route.snapshot.queryParamMap.get('username') || '';

    this.userService.getUserDetails(this.username).subscribe(
      userDetails => {
        this.gender = userDetails.gender;
        this.age = userDetails.age;
      },
      error => {
        console.error('Failed to fetch user details', error);
      }
    );

    // Fetch other users
    this.userService.getAllUsers().subscribe(
      users => {
        this.otherUsersNames = users.map(user => user.username);
        // Filter out the authenticated user's name
        this.otherUsersNames = this.otherUsersNames.filter(username => username !== this.username);
      },
      error => {
        console.error('Failed to fetch other user names', error);
      }
    );
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  // Method to view user profile
  viewUserProfile(otherUserName: string): void {
    this.userService.getUserDetails(otherUserName).subscribe(
      userDetails => {
        this.selectedUser = userDetails;
      },
      error => {
        console.error('Failed to fetch user details', error);
      }
    );
  }
}
