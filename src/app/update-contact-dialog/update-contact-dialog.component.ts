import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Contact } from '../../../model.contact';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-contact-dialog',
  templateUrl: './update-contact-dialog.component.html',
  styleUrls: ['./update-contact-dialog.component.css']
})
export class UpdateContactDialogComponent {

  contact: Contact;

  constructor(
    public dialogRef: MatDialogRef<UpdateContactDialogComponent>,
    private userService: UserService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { contact: Contact }
  ) {
    // Assign the contact data to the component property
    this.contact = { ...data.contact }; // Create a copy to avoid modifying the original data
  }

  onUpdateContact(): void {
    this.userService.updateContact(this.contact).subscribe(
      response => {
        console.log(response);
        this.showSnackbar('Contact modifié avec succès!', 'success-snackbar');
        this.dialogRef.close();
      },
      error => {
        console.error('Erreur lors de la modification du contact', error);
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
