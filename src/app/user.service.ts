import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { User } from '../../model.user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090/api';

  constructor(private http: HttpClient) {}

  getUserDetails(username: string): Observable<any> {
    console.log("username:", username);
    return this.http.get(`${this.apiUrl}/users/${username}`);
  }

  getAllUsers(): Observable<User[]> {
    
    return this.http.get<User[]>(`${this.apiUrl}/users`);

  }
}
