import { Component, OnInit } from '@angular/core';
import { User } from '../../../model.user';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit  {
  username: string = '';
  gender: string = '';
  age: number = 0;
  phoneNumber: number = 0;
  email: string = '';
  otherUsersNames: string[] = [];
  selectedUser: User | null = null;
  

  notificationMessage: string | null = null;

  constructor(private route: ActivatedRoute, private userService: UserService,

    ) {}


    ngOnInit(): void {
    this.username = this.route.snapshot.queryParamMap.get('username') || '';

    // this.notificationService.getNotificationObservable(this.username).subscribe(
    //   (message: string) => {
    //     this.notificationMessage = message;
    //     // You can add a timeout to remove the notification after a few seconds
    //     setTimeout(() => {
    //       this.notificationMessage = null;
    //     }, 5000);
    //   },
    //   (error) => {
    //     console.error('Error in notification component', error);
    //   }
    // );
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
                  }
              );
          },
          error => {
              console.error('Failed to fetch user details', error);
          }
      );
  }
  


 
  // Method to view user profile
  // viewUserProfile(otherUserName: string): void {
  //   this.userService.getUserDetails(otherUserName).subscribe(
  //     userDetails => {
  //       this.selectedUser = userDetails;
  //       // Notify the other user that their profile has been viewed
  //       this.userService.notifyUser(otherUserName, `Your profile has been viewed by ${this.username}`);
  //     },
  //     error => {
  //       console.error('Failed to fetch user details', error);
  //     }
  //   );
  // }

}
