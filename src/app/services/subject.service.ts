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
}
