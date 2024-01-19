import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../model.user';
import { Contact } from '../../../model.contact';

import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateContactDialogComponent } from '../update-contact-dialog/update-contact-dialog.component';
import { ViewNotification } from '../../../model.notification';


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
  newContact: { id: number,contactname: string, email: string, phoneNumber: number } = { id: 0,contactname: '', email: '', phoneNumber: 0 };
  contacts: Contact[] = [];
  notifications: ViewNotification[] = [];


  constructor(private route: ActivatedRoute, private userService: UserService, 
    private router: Router,public dialog: MatDialog,private snackBar: MatSnackBar,
    ) {}

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


    this.userService.listContacts().subscribe(
      (contacts) => {
        this.contacts = contacts;
      },
      (error) => {
        console.error('Failed to fetch contacts', error);
      }
    );

  // Fetch notifications when the component is initialized
    this.userService.getUserNotifications().subscribe(
      (notifications) => {
          this.notifications = notifications;
      },
      (error) => {
          console.error('Failed to fetch notifications', error);
      }
  );

  }



    // Variable to track the sort direction
    isAscending: boolean = true;

    // Function to toggle the sort direction
    toggleSortDirection(): void {
      this.isAscending = !this.isAscending;
      this.sortContacts();
    }
  
    // Function to sort the contacts array
    sortContacts(): void {
      this.contacts.sort((a, b) => {
        const nameA = a.contactname.toUpperCase();
        const nameB = b.contactname.toUpperCase();
  
        if (nameA < nameB) {
          return this.isAscending ? -1 : 1;
        }
        if (nameA > nameB) {
          return this.isAscending ? 1 : -1;
        }
        return 0;
      });
    }

    
  logout(): void {
    this.router.navigate(['/login']);
  }


  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass]
    });
  }

  removeContact(contact: Contact): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Supression du contact:', message: 'Voulez-vous vraiment supprimer ce contact?' },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.removeContact(contact).subscribe(
          (response) => {
            if (response && response.message === 'Contact removed successfully') {
              console.log(response.message);
              this.showSnackbar('Contact supprimé avec succès!', 'success-snackbar');
              this.contacts = this.contacts.filter((c) => c !== contact);
            } else {
              console.error('Erreur inattendue lors de la suppression du contact');
            }
          },
          (error) => {
            console.error('Erreur lors de la suppression du contact', error);
          }
        );
      }
    });
  }
  


  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactDialogComponent, {
      width: '400px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  openUpdateContactDialog(contact: Contact): void {
    const dialogRef = this.dialog.open(UpdateContactDialogComponent, {
      width: '400px',
      data: { contact: contact }, // Pass the contact data to the dialog
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
  
  
}
