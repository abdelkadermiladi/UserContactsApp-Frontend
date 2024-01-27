import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private jwtToken: string | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    const credentials = { username, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>('http://localhost:8090/auth/login', credentials, { headers });
  }

  register(userDetails: any): Observable<any> {
    const registerUrl = `http://localhost:8090/auth/register`;
    return this.http.post(registerUrl, userDetails);
  }

  setJwtToken(token: string): void {
    this.jwtToken = token;
    localStorage.setItem('jwtToken', token);
  }

  getJwtToken(): string | null {
    // Retrieve the token from storage
    return this.jwtToken || localStorage.getItem('jwtToken');
  }

  clearJwtToken(): void {
    // Clear the token from storage
    this.jwtToken = null;
    localStorage.removeItem('jwtToken');
  }
}
