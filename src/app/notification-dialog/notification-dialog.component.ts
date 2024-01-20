import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ViewNotification } from '../../../model.notification';

@Component({
  selector: 'app-notification-dialog',
  templateUrl: './notification-dialog.component.html',
  styleUrls: ['./notification-dialog.component.css']
})
export class NotificationDialogComponent implements OnInit {
  sortedNotifications: ViewNotification[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.sortedNotifications = this.data.notifications
      .sort((a: { time: string | number | Date; }, b: { time: string | number | Date; }) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }

  formatElapsedTime(elapsedTimeInMinutes: number): string {
    if (elapsedTimeInMinutes < 1) {
      const elapsedTimeInSeconds = Math.floor(elapsedTimeInMinutes * 60);
      return `${elapsedTimeInSeconds} seconds ago`;
    } else if (elapsedTimeInMinutes < 60) {
      return `${elapsedTimeInMinutes} minutes ago`;
    } else if (elapsedTimeInMinutes < 1440) { // 60 minutes * 24 heures
      const elapsedTimeInHours = Math.floor(elapsedTimeInMinutes / 60);
      return `${elapsedTimeInHours} hours ago`;
    } else {
      const elapsedTimeInDays = Math.floor(elapsedTimeInMinutes / 1440);
      return `${elapsedTimeInDays} days ago`;
    }
  }

  calculateTimeElapsed(notificationTime: Date | string): string {
    const currentTime = Date.now();
    
    // Vérifier si notificationTime est une instance de Date
    const notificationTimeInMilliseconds = (notificationTime instanceof Date) 
      ? notificationTime.getTime() 
      : new Date(notificationTime).getTime(); // Convertir la chaîne de caractères en objet Date

    const elapsedTimeInMilliseconds = currentTime - notificationTimeInMilliseconds;
    const elapsedTimeInMinutes = Math.floor(elapsedTimeInMilliseconds / 60000);

    return this.formatElapsedTime(elapsedTimeInMinutes);
  }
}
