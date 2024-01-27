import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs';
import { User } from '../../user.model';
import { Contact } from '../../contact.model';
import { ViewNotification } from '../../notification.model';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  getUserDetails(username: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`,{ headers });
  }

  getAllUsers(headers: HttpHeaders): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`,{ headers });
  }

  addContact(contact: { contactname: string, email: string, phoneNumber: number },headers: HttpHeaders): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-contact`, contact, { headers });
  }

  listContacts(headers: HttpHeaders): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/list-contacts`, { headers });
  }


  removeContact(contact: Contact,headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/remove-contact/${contact.id}`;
    return this.http.delete(url,{ headers });
  }

  updateContact(contact: Contact,headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/update-contact/${contact.id}`;
    return this.http.put(url,contact,{ headers });
  }

  getUserNotifications(headers: HttpHeaders): Observable<ViewNotification[]> {
    return this.http.get<ViewNotification[]>(`${this.apiUrl}/notifications`,{ headers });
  }
  addUserNotification(viewedUsername: string,headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/users/${viewedUsername}`;
    return this.http.post(url, {},{ headers });
  }

}
