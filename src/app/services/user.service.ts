import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/users";

  allUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: string) : Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
  }

  searchUserByDni(dni: String): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/dni/${dni}`)
  }

  createUser(user: User) : Observable<Object> {
    return this.http.post(this.apiUrl, user)
  }

  modifyUser(id: string, user: User) {
    return this.http.put(`${this.apiUrl}/${id}`, user)
  }

  deleteUser(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }
}
