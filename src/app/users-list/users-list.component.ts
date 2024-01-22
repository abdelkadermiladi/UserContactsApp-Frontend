// users-list.component.ts
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../../user.model';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { UserProfileDialogComponent } from '../user-profile-dialog/user-profile-dialog.component';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  username: string = '';
  gender: string = '';
  age: number = 0;
  phoneNumber: number = 0;
  email: string = '';
  otherUsersNames: string[] = [];
  selectedUser: User | null = null;
  notificationMessage: string | null = null;
  searchInput: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.username = this.route.snapshot.queryParamMap.get('username') || '';

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

  viewUserProfile(otherUserName: string): void {
    this.userService.getUserDetails(otherUserName).subscribe(
      userDetails => {
        this.selectedUser = userDetails;

              // Add notification when user's profile is viewed
              this.userService.addUserNotification(otherUserName).subscribe(
                response => {
                    console.log(response);
                    // Handle success if needed
                },
                error => {
                    console.error('Error adding notification', error);
                });

        // Open the dialog with user details
        const dialogRef = this.dialog.open(UserProfileDialogComponent, {
          data: { user: this.selectedUser }
        });

        dialogRef.afterClosed().subscribe(result => {
          // Handle dialog close if needed
        });
      },
      error => {
        console.error('Failed to fetch user details', error);
      }
    );
  }

  onSearchInputChange(): void {
    // If search input is empty, show all users
    if (!this.searchInput.trim()) {
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
    } else {
      // Filter users based on case-insensitive search input
      this.otherUsersNames = this.otherUsersNames.filter(username =>
        username.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    }
  }
}
