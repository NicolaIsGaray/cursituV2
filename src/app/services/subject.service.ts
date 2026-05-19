import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Subject } from '../models/subject.model';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private http = inject(HttpClient);
  private apiUrl = "http://localhost:8080/api/subjects"

  private readonly SUBJECT_KEY = "cursitu_selected_subject"

  setItemInStorage(value: any): void {
    localStorage.setItem(this.SUBJECT_KEY, JSON.stringify(value));
  }

  getItemFromStorage<T>(): T | null {
    const item = localStorage.getItem(this.SUBJECT_KEY);
    return item ? JSON.parse(item) : null;
  }

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
