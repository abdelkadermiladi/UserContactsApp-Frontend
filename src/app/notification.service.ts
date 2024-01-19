// // notification.service.ts
// import { Injectable } from '@angular/core';
// import { WebSocketService } from './web-socket.service';
// import { Subject } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class NotificationService {

  
//   private notifications = new Subject<string>();

//   constructor(private webSocketService: WebSocketService) {
//   }

//   private subscribeToNotifications(username: string): void {
//     this.webSocketService.subscribeToNotifications(username).subscribe(
//       (message: string) => {
//         this.notifications.next(message);
//       },
//       (error) => {
//         console.error('Error in notification subscription', error);
//       }
//     );
//   }
  
//   getNotificationObservable(username: string): Subject<string> {
//     this.subscribeToNotifications(username);
//     return this.notifications;
//   }
// }  
