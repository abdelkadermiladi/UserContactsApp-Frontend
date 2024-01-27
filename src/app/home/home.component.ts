import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { User } from '../../../user.model';
import { Contact } from '../../../contact.model';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../add-contact-dialog/add-contact-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateContactDialogComponent } from '../update-contact-dialog/update-contact-dialog.component';
import { ViewNotification } from '../../../notification.model';
import { NotificationDialogComponent } from '../notification-dialog/notification-dialog.component';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';


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
  // Variable to track the sort direction
  isAscending: boolean = true;


  constructor(private route: ActivatedRoute, private userService: UserService, 
    private router: Router,public dialog: MatDialog,private snackBar: MatSnackBar,
    private authService:AuthService,
    private location: Location
    ) {}


    jwtToken = this.authService.getJwtToken();
    headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);


  ngOnInit(): void {


    // Fetch user information from the backend based on the username
    this.username = this.route.snapshot.queryParamMap.get('username') || '';

    this.userService.getUserDetails(this.username,this.headers).subscribe(
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


    this.userService.listContacts(this.headers).subscribe(
      (contacts) => {
        this.contacts = contacts;
      },
      (error) => {
        console.error('Failed to fetch contacts', error);
      }
    );

    // Fetch notifications when the component is initialized
    this.userService.getUserNotifications(this.headers).subscribe(
      (notifications) => {
          this.notifications = notifications;
      },
      (error) => {
          console.error('Failed to fetch notifications', error);
      }
    );


}

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
    this.authService.clearJwtToken();

    this.router.navigate(['/welcome']);
    this.location.replaceState('/');
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
        this.userService.removeContact(contact,this.headers).subscribe(
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
  
  openNotificationDialog(): void {
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '500px', 
      data: { notifications: this.notifications }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('La boîte de dialogue a été fermée');
    });
  }
  
}
