// user-profile-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from '../../../user.model';

@Component({
  selector: 'app-user-profile-dialog',
  templateUrl: './user-profile-dialog.component.html',
  styleUrls: ['./user-profile-dialog.component.css']
})
export class UserProfileDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: User }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
