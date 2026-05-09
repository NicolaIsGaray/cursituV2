import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private url = "http://localhost:8080/api/users";

  allUsers() : Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }
}
