import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { environment } from '../../environments/environment.development';
import { Assignment } from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api}/topics`;

  private readonly TOPIC_KEY = 'cursitu_selected_topic';

  setTopicInStorage(value: any): void {
    localStorage.setItem(this.TOPIC_KEY, JSON.stringify(value));
  }

  getTopicFromStorage<T>(): T | null {
    const topic = localStorage.getItem(this.TOPIC_KEY);
    return topic ? JSON.parse(topic) : null;
  }

  getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.apiUrl);
  }

  getTopicById(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/${id}`);
  }

  submitTopic(payload: {
    mode: string;
    topic: Topic;
    assignment: Assignment | null;
    classroom_id: string;
  }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, payload);
  }

  modifyTopic(
    id: string,
    payload: {
      mode: string;
      topic: Topic;
      assignment: Assignment | null;
      classroom_id: string;
    },
  ) {
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteTopic(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
