import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from '../models/subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/subjects"

  getAllSubjects() : Observable<Subject[]> {
    return this.http.get<Subject[]>(this.apiUrl);
  }

  getSubjectById(id: string) : Observable<Subject> {
    return this.http.get<Subject>(`${this.apiUrl}/${id}`);
  }

  createSubject(subject: Subject): Observable<Object> {
    return this.http.post(this.apiUrl, subject);
  }

  modifySubject(id: string, subject: Subject) {
    return this.http.put(`${this.apiUrl}/${id}`, subject);
  }

  deleteSubject(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
