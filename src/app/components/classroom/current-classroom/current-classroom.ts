import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Classroom } from '../../../models/classroom.model';
import { ClassroomService } from '../../../services/classroom.service';
import { SubjectService } from '../../../services/subject.service';
import { Subject } from '../../../models/subject.model';
import { Topic } from '../../../models/topic.model';
import { BehaviorSubject, forkJoin, Observable, tap } from 'rxjs';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'app-classroom',
  imports: [CommonModule, RouterModule],
  templateUrl: './current-classroom.html',
  styleUrl: './current-classroom.css',
})
export class CurrentClassroom implements OnInit {
  classroomId: string | null = null;
  subject?: Subject;
  classroom?: Classroom;
  topicsList$?: Observable<Topic[]>;
  
  private selectedTopicSubject = new BehaviorSubject<Topic | null>(null);
  selectedTopic$ = this.selectedTopicSubject.asObservable();

  constructor(
    public authService: AuthService,
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private subjectService: SubjectService,
    private topicService: TopicService
  ) {}

  ngOnInit(): void {
    this.classroomId = this.route.snapshot.paramMap.get('id');

    if (this.classroomId) {
      this.loadClassroom(this.classroomId);
    } else {
      console.error('No se ha encontrado el ID de la materia.');
    }
  }

  loadClassroomTopics() {
  const ids = this.classroom?.topics_id;

  if (ids && ids.length > 0) {
    const requests = ids.map(id => this.topicService.getTopicById(id));
    
    this.topicsList$ = forkJoin(requests);
    this.topicsList$.forEach(t => {
      if (t.length > 0 && !this.selectedTopicSubject.value) {
          this.seleccionarTema(t[0]);
        }
    })
  } else {
    console.error("No hay temas cargados.");
  }
}

  seleccionarTema(topic: Topic) {
    this.selectedTopicSubject.next(topic);
  }

  getLinkedSubject(id: string) {
    this.subjectService.getSubjectById(id).subscribe({
      next: (data) => {
        this.subject = data
        this.loadClassroomTopics();
      },
      error: (err) => console.error("No se ha podido obtener la materia asignada: ", err)
      
    })
  }

  loadClassroom(id: string) {
    this.classroomService.getClassroomById(id).subscribe({
      next: (data) => {
        this.classroom = data;
        this.getLinkedSubject(this.classroom.subject_id!);
      },
      error: (err) => console.error("Hubo un error al obtener el curso: ", err)
      
    })
  }
}
