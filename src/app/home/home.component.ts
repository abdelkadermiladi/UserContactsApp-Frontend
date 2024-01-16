import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../model.user';
import { Contact } from '../../../model.contact';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  
})
export class HomeComponent implements OnInit {
  username: string = '';
  gender: string = '';
  age: number = 0;
  phoneNumber: number = 0;
  email: string = '';
  otherUsersNames: string[] = [];
  selectedUser: User | null = null;
  newContact: { contactname: string, email: string, phoneNumber: number } = { contactname: '', email: '', phoneNumber: 0 };
  contacts: Contact[] = [];

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    // Fetch user information from the backend based on the username
    this.username = this.route.snapshot.queryParamMap.get('username') || '';

    this.userService.getUserDetails(this.username).subscribe(
      userDetails => {
        this.gender = userDetails.gender;
        this.age = userDetails.age;
        this.phoneNumber = userDetails.phoneNumber;
        this.email = userDetails.email;
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

    this.userService.listContacts().subscribe(
      (contacts) => {
        this.contacts = contacts;
      },
      (error) => {
        console.error('Failed to fetch contacts', error);
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


  onAddContact(): void {
    this.userService.addContact(this.newContact).subscribe(
      response => {
        console.log(response);
        // Rafraîchir la liste des utilisateurs ou effectuer d'autres actions nécessaires
      },
      error => {
        console.error('Erreur lors de l\'ajout du contact', error);
        if (error.status === 400 && error.error && error.error.error === 'Contact already exists') {
          this.errorMessage = 'Ce contact existe déjà';
        }
      }
    );
  }

  errorMessage: string = '';
  clearErrorMessage(): void {
    this.errorMessage = '';
  }
}
