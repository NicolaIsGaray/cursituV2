import { inject, Injectable } from '@angular/core';
import { Classroom } from '../models/classroom.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Assignment } from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class ClassroomService {
  private http = inject(HttpClient)
  private apiUrl = `${environment.api}/classrooms`

  getClassroomById(id: string): Observable<Classroom> {
    return this.http.get<Classroom>(`${this.apiUrl}/${id}`)
  }

  createClassroom(classroom: Classroom): Observable<Object> {
    return this.http.post(this.apiUrl, classroom)
  }

  modifyClassroom(id: string, classroom: Classroom) {
    return this.http.put(`${this.apiUrl}/${id}`, classroom);
  }

  deleteClassroom(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtainClassroomActivities(id: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments/${id}`);
  }

  obtainClassroomTasks(id: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/tasks/${id}`);
  }

  obtainClassroomExams(id: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/exams/${id}`);
  }
}
