import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../../services/subject.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Subject } from '../../../models/subject.model';
import { QuillEditorComponent } from 'ngx-quill';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Topic } from '../../../models/topic.model';
import { TopicService } from '../../../services/topic.service';
import { Classroom } from '../../../models/classroom.model';
import { ClassroomService } from '../../../services/classroom.service';
import { Router } from '@angular/router';
import { Assignment } from '../../../models/assignment.model';
import { AssignmentService } from '../../../services/assignment.service';

@Component({
  selector: 'app-add-class',
  imports: [CommonModule, QuillEditorComponent, ReactiveFormsModule],
  templateUrl: './add-class.html',
  styleUrl: './add-class.css',
})
export class AddClass implements OnInit {
  mode: 'teorico' | 'entregable' = 'teorico';
  assignmentFormat: 'archivo' | 'carpeta' | 'texto' = 'archivo';
  assignmentType: 'tarea' | 'parcial' = 'tarea';
  assignmentEnabled: 'habilitado' | 'deshabilitado' = 'habilitado';
  enableToDeliver: boolean = true;

  subject$!: Observable<Subject>;
  subjectId: string | null = null;

  currentClassroom: Classroom | null = null;
  classroomId: string | null = null;

  topicForm!: FormGroup;
  newTopic!: Topic;

  assignmentForm!: FormGroup;
  newAssignment!: Assignment;

  editorModules = {
    toolbar: [
      [{ size: [ 'small', false, 'large', 'huge' ]}],
      ['bold', 'italic', 'underline', 'clean'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  constructor(
    public authService: AuthService,
    private subjectService: SubjectService,
    private topicService: TopicService,
    private assignmentService: AssignmentService,
    private classroomService: ClassroomService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getSelectedSubjectAndClassroom();
  }

  initForm() {
    this.topicForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
    });
  }

  initAssignmentForm() {
    this.assignmentForm = this.fb.group({
      assignmentTitle: ['', Validators.required],
      assignmentContent: [''],
      assignmentLimit: ['', Validators.required]
    });
  }

  getSelectedSubjectAndClassroom() {
    this.subjectId = this.subjectService.getItemFromStorage();
    if (!this.subjectId) {
      console.error('No se encontró el ID de la materia en el Storage.');
      return;
    }

    this.subject$ = this.subjectService.getSubjectById(this.subjectId);

    this.subject$.subscribe({
      next: (subjectData) => {
        document.documentElement.style.setProperty('--subject-color', subjectData.color);

        this.classroomId = subjectData.classroom_id!;

        this.loadCurrentClassroom(this.classroomId);
      },
      error: (err) => console.error('Error al obtener la materia: ', err),
    });
  }

  loadCurrentClassroom(classroomId: string) {
    this.classroomService.getClassroomById(classroomId).subscribe({
      next: (classroomData) => {
        this.currentClassroom = classroomData;
      },
      error: (err) => console.error('Error al obtener el aula virtual: ', err),
    });
  }

  onSubmit() {
    if (this.topicForm.invalid || !this.currentClassroom) return;

    const { title, content } = this.topicForm.value;

    // Estructura base del Topic
    this.newTopic = {
      title: title.trim(),
      content: content,
      classroom_id: this.classroomId!,
      assignment_id: null!, // Se inicializa nulo o vacío
    };

    if (this.mode === 'entregable') {
      if (this.assignmentForm.invalid) return; // Validación preventiva del segundo formulario

      const { assignmentTitle, assignmentContent, assignmentLimit } = this.assignmentForm.value;

      this.newAssignment = {
        title: assignmentTitle.trim(),
        content: assignmentContent,
        date_limit: assignmentLimit,
        allowed_format: this.assignmentFormat,
        type: this.assignmentType,
        enabled_to_deliver: this.enableToDeliver,
        subject_id: this.subjectId!,
      };
    } else {
      this.newAssignment = null!;
    }

    this.submitTopic();
  }

  submitTopic() {
    const assignmentObservable$ =
      this.mode === 'entregable' && this.newAssignment
        ? this.assignmentService.createAssignment(this.newAssignment)
        : of<any>(null);

    assignmentObservable$
      .pipe(
        switchMap((createdAssignment: any) => {
          if (createdAssignment && createdAssignment.id) {
            this.newTopic.assignment_id = createdAssignment.id;
          }

          return this.topicService.createTopic(this.newTopic);
        }),
      )
      .subscribe({
        next: (createdTopic: any) => {
          const topicId = (createdTopic as Topic).id!;
          const currentTopics = this.currentClassroom?.topics_id || [];

          if (!currentTopics.includes(topicId)) {
            const updatedClassroom: Classroom = {
              ...this.currentClassroom!,
              topics_id: [...currentTopics, topicId],
            };

            this.updateClassroomTopics(updatedClassroom);
          } else {
            this.navigateToClassroom();
          }
        },
        error: (err) => console.error('Hubo un error en el flujo de creación: ', err),
      });
  }

  updateClassroomTopics(updatedClassroom: Classroom) {
    this.classroomService.modifyClassroom(updatedClassroom.id!, updatedClassroom).subscribe({
      next: () => {
        this.currentClassroom = updatedClassroom;
        alert('Sección Creada Exitosamente.');
        this.navigateToClassroom();
      },
      error: (err) => console.error('Hubo un error al asociar el tema al curso: ', err),
    });
  }

  navigateToClassroom() {
    this.router.navigate([`/current-classroom`, this.classroomId]);
  }

  switchMode(newMode: 'teorico' | 'entregable') {
    this.mode = newMode;

    if (this.mode === 'entregable') {
      this.initAssignmentForm();
    } else if (this.mode === 'teorico') {
      this.assignmentForm.reset();
    }
  }

  setFormat(newFormat: 'archivo' | 'carpeta' | 'texto') {
    this.assignmentFormat = newFormat;
  }

  setType(newType: 'tarea' | 'parcial') {
    this.assignmentType = newType;
  }

  setAvaiability(isAvaiable: 'habilitado' | 'deshabilitado') {
    this.assignmentEnabled = isAvaiable;

    if (this.assignmentEnabled === 'habilitado') {
      this.enableToDeliver = true;
    }
    else if (this.assignmentEnabled === 'deshabilitado') {
      this.enableToDeliver = false;
    }
  }
}
