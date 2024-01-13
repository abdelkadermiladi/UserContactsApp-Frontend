import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8090/api'; // Update with your backend API URL

  constructor(private http: HttpClient) {}

  getUserDetails(username: string): Observable<any> {
    console.log("username:" , username)
    return this.http.get(`${this.apiUrl}/users/${username}`);
  }
}
