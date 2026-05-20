import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Topic } from '../models/topic.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TopicService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api}/topics`

  getAllTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(this.apiUrl);
  }

  getTopicById(id: string): Observable<Topic> {
    return this.http.get<Topic>(`${this.apiUrl}/${id}`);
  }

  createTopic(topic: Topic): Observable<Object> {
    return this.http.post(this.apiUrl, topic);
  }

  modifyTopic(id: string, topic: Topic) {
    return this.http.put(`${this.apiUrl}/${id}`, topic);
  }

  deleteTopic(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
