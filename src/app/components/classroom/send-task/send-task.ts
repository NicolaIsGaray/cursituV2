import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from '../../../models/subject.model';
import { SubjectService } from '../../../services/subject.service';
import { filter, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { Assignment } from '../../../models/assignment.model';
import { AssignmentService } from '../../../services/assignment.service';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-send-task',
  imports: [CommonModule, RouterModule, QuillEditorComponent],
  templateUrl: './send-task.html',
  styleUrl: './send-task.css',
})
export class SendTask implements OnInit {
  hasSubmitted: boolean = false;
  submissionDate!: Date;
  submissionStatus: 'A término' | 'Fuera de término' = 'A término';
  submissionText: string = '';
  submissionComment: string = '';
  selectedFile: File | null = null;

  subjectId: string | null = null;
  currentSubject$!: Observable<Subject>;

  activityId: string | null = null;
  currentActivity$!: Observable<Assignment>;

  editorModules = {
    toolbar: [
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'clean'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  constructor(
    private subjectService: SubjectService,
    private assignmentService: AssignmentService,
    private activeRoute: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.activityId = this.activeRoute.snapshot.paramMap.get('id');

    if (this.activityId) {
      this.currentActivity$ = this.assignmentService.getAssignmentById(this.activityId).pipe(
        tap((activity) => {
          if (activity) {
            this.subjectId = activity.subject_id;
          }
        }),
        shareReplay(1),
      );

      this.currentSubject$ = this.currentActivity$.pipe(
        filter((activity) => !!activity),
        switchMap((activity) => this.subjectService.getSubjectById(activity.subject_id)),
        tap((subject) => {
          if (subject?.color) {
            document.documentElement.style.setProperty('--subject-color', subject.color);
          }
        }),
        shareReplay(1),
      );
    } else {
      console.error('No se encontró el ID de la actividad en la ruta.');
    }
  }

  formatDate(original: Date | string): string {
    const date = new Date(original);

    const formatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    let formattedDate = formatter.format(date);

    formattedDate = formattedDate.replace(/,/g, '');
    formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    formattedDate = formattedDate.replace(/\./g, '').toUpperCase();

    return formattedDate;
  }

  isDeliveryOpen(dateLimitStr: Date): boolean {
    const limit = new Date(dateLimitStr);
    return new Date() <= limit;
  }

  enviarEntrega(activity: any) {
    this.submissionDate = new Date();
    const limit = new Date(activity.date_limit);

    this.submissionStatus = this.submissionDate <= limit ? 'A término' : 'Fuera de término';

    this.hasSubmitted = true;
  }

  triggerFileInput() {
    alert('Simulación de carga de archivo.');
  }

  goBack() {
    this.location.back();
  }
}
