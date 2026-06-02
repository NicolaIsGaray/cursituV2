import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject } from '../../../models/subject.model';
import { SubjectService } from '../../../services/subject.service';
import { filter, Observable, shareReplay, switchMap, tap } from 'rxjs';
import { Assignment } from '../../../models/assignment.model';
import { AssignmentService } from '../../../services/assignment.service';
import { QuillEditorComponent } from 'ngx-quill';
import { Submission } from '../../../models/submission.model';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppwriteService } from '../../../services/appwrite.service';
import { FileDTO } from '../../../models/dto/fileDTO';

@Component({
  selector: 'app-send-task',
  imports: [CommonModule, RouterModule, QuillEditorComponent, ReactiveFormsModule],
  templateUrl: './send-task.html',
  styleUrl: './send-task.css',
})
export class SendTask implements OnInit {
  submissionDate!: Date;
  submissionTimeStatus: 'A término' | 'Fuera de término' = 'A término';
  submissionText: string = '';
  submissionComment: string = '';
  selectedFile: File | null = null;

  subjectId: string | null = null;
  currentSubject$!: Observable<Subject>;

  activityId: string | null = null;
  currentActivity$!: Observable<Assignment>;

  newSubmit!: Submission;

  submitForm!: FormGroup;
  submissionStatus$!: Observable<Submission>;

  fileToSend!: FileDTO;
  fileUrl: string | null = null;
  uploadedFile: File | null = null;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'clean'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  private appwriteService = inject(AppwriteService);

  constructor(
    private subjectService: SubjectService,
    private assignmentService: AssignmentService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private location: Location,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.activityId = this.activeRoute.snapshot.paramMap.get('id');
    this.loadSubmissionStatus();

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

  initForm() {
    this.submitForm = this.fb.group({
      comment: [''],
    });
  }

  private loadSubmissionStatus(): void {
    this.submissionStatus$ = this.assignmentService.getStudentNewSubmission(
      this.authService.currentUserValue?.id!,
      this.activityId!,
    );
  }

  formatDateDisplay(original: Date | string): string {
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

  async sendActivity(activity: Assignment) {
    this.submissionDate = new Date();
    const limit = new Date(activity.date_limit);

    let subject = new Subject();
    this.subjectService.getSubjectById(this.subjectId!).subscribe({
      next: (s) => {
        subject = s;
      },
      error: (err) => console.error(err),
    });

    this.submissionTimeStatus = this.submissionDate <= limit ? 'A término' : 'Fuera de término';

    const timezoneOffsetOffset = this.submissionDate.getTimezoneOffset() * 60000;

    const localISODate = new Date(
      this.submissionDate.getTime() - timezoneOffsetOffset,
    ).toISOString();

    const formattedDate = localISODate.split('.')[0];

    const { comment } = this.submitForm.value;

    let folderName = subject.subject_name.replace(/ /g, '-') + '-' + subject.year_level + 'año';

    if (this.uploadedFile) {
      const downloadUrl = await this.appwriteService.uploadFiles(
        this.uploadedFile,
        `/deliveries-${folderName}`,
      );

      this.fileToSend = {
        fileName: this.uploadedFile.name,
        url: downloadUrl,
      };
    }

    this.newSubmit = {
      comment: comment,
      fileName: this.fileToSend.fileName === null ? 'Archivo Adjunto' : this.fileToSend.fileName,
      file_url: this.fileToSend.url === null ? '' : this.fileToSend.url,
      submission_date: formattedDate,
    };

    this.assignmentService
      .submitActivity(this.activityId!, this.authService.currentUserValue?.id!, this.newSubmit)
      .subscribe({
        next: () => {
          alert('Actividad Entregada Exitosamente.');
          this.submitForm.reset();
          this.loadSubmissionStatus();

          this.cdr.detectChanges();
        },
        error: (err) => console.error('Hubo un error al entregar la actividad: ', err),
      });
  }

  onFileSelected(e: any): void {
    this.uploadedFile = e.target.files[0];
    if (!this.uploadedFile) return;

    const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

    if (this.uploadedFile.size > MAX_FILE_SIZE_BYTES) {
      alert(`El archivo "${this.uploadedFile.name}" supera el límite máximo permitido de 50 MB.`);
    }
  }

  goBack() {
    this.location.back();
  }
}
