import { inject, Injectable } from '@angular/core';
import { Classroom } from '../models/classroom.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private http = inject(HttpClient)
  private apiUrl = "http://localhost:8080/api/classrooms"

  getClassroomById(id: string) : Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`)
  }
}
