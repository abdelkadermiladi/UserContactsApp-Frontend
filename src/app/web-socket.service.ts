// import { Injectable } from '@angular/core';
// import SockJS from 'sockjs-client';
// import { Client, IFrame } from '@stomp/stompjs';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class WebSocketService {
//   private stompClient!: Client;

//   constructor() {
//     this.initializeWebSocketConnection();
//   }

//   private initializeWebSocketConnection(): void {
//     const socket = new SockJS('http://localhost:8090/ws');
//     this.stompClient = new Client({
//       brokerURL: 'http://localhost:8090/ws',
//       connectHeaders: {},
//       debug: (str: string) => {
//         console.log(str);
//       },
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//     });

//     this.stompClient.onConnect = (frame: IFrame) => {
//       console.log('Connected: ' + frame);
//     };

//     this.stompClient.activate();
//   }

//   public notifyUser(username: string, message: string): void {
//     const destination = `/app/notify/${username}`;
//     if (this.stompClient.active) {
//       this.stompClient.publish({
//         destination,
//         body: JSON.stringify({ message }),
//       });
//     } else {
//       console.error('WebSocket not connected.');
//     }
//   }

//   public subscribeToNotifications(username: string): Observable<any> {
//     const destination = `/topic/notifications/${username}`;

//     return new Observable(observer => {
//       if (this.stompClient.active) {
//         const subscription = this.stompClient.subscribe(destination, (frame: IFrame) => {
//           observer.next(JSON.parse(frame.body));
//         });

//         return () => {
//           subscription.unsubscribe();
//         };
//       } else {
//         console.error('WebSocket not connected.');
//         return () => {}; // Add this line to satisfy the return type
//       }
//     });
//   }
// }
