import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../model.user';
import { Contact } from '../../model.contact';
//import { Contact } from '../../model.contact';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  getUserDetails(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${username}`);
  }

  getAllUsers(): Observable<User[]> {
    
    return this.http.get<User[]>(`${this.apiUrl}/users`);

  }

  addContact(contact: { contactname: string, email: string, phoneNumber: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-contact`, contact);
  }

  listContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/list-contacts`);
  }


  removeContact(contact: Contact): Observable<any> {
    const url = `${this.apiUrl}/remove-contact/${contact.contactname}`;
    return this.http.delete(url);
  }
  

}
