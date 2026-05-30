import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../models/group.model';
import { environment } from '../../environments/environment.development';
import { GroupDTO } from '../models/dto/groupDTO';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api}/groups`

  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(id: string): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  getGroupsInSubject(subjectId: string): Observable<Group[]> {
    return this.http.get<Group[]>(`${this.apiUrl}/subject/${subjectId}`);
  }

  getCurrentStudentGroups(studentId: string, subjectId: string): Observable<GroupDTO[]> {
    return this.http.get<GroupDTO[]>(`${this.apiUrl}/user/${studentId}/groups/${subjectId}`);
  }

  createGroup(group: Group): Observable<Object> {
    return this.http.post(this.apiUrl, group);
  }

  updateGroup(groupId: string, group: Group) {
    return this.http.put(`${this.apiUrl}/${groupId}`, group);
  }

  deleteGroup(groupId: string) {
    return this.http.delete(`${this.apiUrl}/${groupId}`);
  }
}
