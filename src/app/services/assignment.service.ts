import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Assignment } from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api}/assignment`;

  getAllAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.apiUrl).pipe(
      map((assignments: Assignment[]) =>
        assignments.map((assignment) => ({
          ...assignment,
          date_limit: new Date(assignment.date_limit),
        })),
      ),
    );
  }

  getAssignmentById(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/${id}`).pipe(
      map((assignment) => ({
        ...assignment,
        date_limit: new Date(assignment.date_limit),
      })),
    );
  }

  createAssignment(assignment: Assignment): Observable<Object> {
    return this.http.post(this.apiUrl, assignment);
  }

  modifyAssignment(id: string, assignment: Assignment) {
    return this.http.put(`${this.apiUrl}/${id}`, assignment);
  }

  deleteAssignment(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
