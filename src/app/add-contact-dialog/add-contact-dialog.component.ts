import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-contact-dialog',
  templateUrl: './add-contact-dialog.component.html',
  styleUrls: ['./add-contact-dialog.component.css']
})
export class AddContactDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private authService:AuthService

  ) {}
  
  jwtToken = this.authService.getJwtToken();
  headers = new HttpHeaders().set('Authorization', `Bearer ${this.jwtToken}`);

  newContact: { contactname: string, email: string, phoneNumber: number } = { contactname: '', email: '', phoneNumber: 0 };

  onAddContact(): void {
    this.userService.addContact(this.newContact,this.headers).subscribe(
      response => {
        console.log(response);
        this.showSnackbar('Contact ajouté avec succès!', 'success-snackbar');
        this.dialogRef.close();
      },
      error => {
        console.error('Erreur lors de l\'ajout du contact', error);
        if (error.status === 400) {
          if (error.error && error.error.error === 'Contact already exists') {
            this.showSnackbar('Ce contact existe déjà', 'error-snackbar');
          } else if (error.error && error.error.error === 'Invalid email address') {
            this.showSnackbar('Email non valide', 'error-snackbar');
          } else if (error.error && error.error.error === 'Validation error') {
            this.showSnackbar('Veuillez vérifier les contraintes de saisie', 'error-snackbar');
          }
        }
      }
    );
  }
  

  // Function to display snackbar
  private showSnackbar(message: string, panelClass: string): void {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [panelClass]
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
