import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { Assignment } from '../models/assignment.model';
import { Submission } from '../models/submission.model';
import { AssignmentDTO } from '../models/dto/assignmentDTO';

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

  getPendingAssignments(studentId: string): Observable<AssignmentDTO[]> {
    return this.http.get<AssignmentDTO[]>(`${this.apiUrl}/student/${studentId}/pending`);
  }

  checkSubmissionStatus(studentId: string, activityId: string): Observable<{ status: string }> {
    let params = new HttpParams();

    params = params.append('studentId', studentId);
    params = params.append('activityId', activityId);

    return this.http.get<{ status: string }>(`${this.apiUrl}/check-status`, { params });
  }

  submitActivity(
    activityId: string,
    studentId: string,
    submission: Submission,
  ): Observable<Object> {
    let params = new HttpParams();

    params = params.append('activityId', activityId);
    params = params.append('studentId', studentId);

    return this.http.post(`${this.apiUrl}/submit-activity`, submission, { params });
  }
}
