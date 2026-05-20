import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api}/groups`

  getAllGroups() : Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(id: string) : Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }
}
