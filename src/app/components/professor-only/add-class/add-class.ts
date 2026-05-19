import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../../services/subject.service';
import { Observable } from 'rxjs';
import { Subject } from '../../../models/subject.model';
import { QuillEditorComponent } from 'ngx-quill';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Topic } from '../../../models/topic.model';
import { TopicService } from '../../../services/topic.service';
import { Classroom } from '../../../models/classroom.model';
import { ClassroomService } from '../../../services/classroom.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-class',
  imports: [CommonModule, QuillEditorComponent, ReactiveFormsModule],
  templateUrl: './add-class.html',
  styleUrl: './add-class.css',
})
export class AddClass implements OnInit {
  mode: 'teorico' | 'entregable' = 'teorico';
  assignmentFormat: 'archivo' | 'carpeta' | 'texto' = 'archivo';

  subject$!: Observable<Subject>;
  subjectId: string | null = null;

  currentClassroom: Classroom | null = null;
  classroomId: string | null = null;

  topicForm!: FormGroup;
  newTopic!: Topic;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'clean'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link'],
    ],
  };

  constructor(
    public authService: AuthService,
    private subjectService: SubjectService,
    private topicService: TopicService,
    private classroomService: ClassroomService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getSelectedSubjectAndClassroom();
  }

  initForm() {
    this.topicForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  getSelectedSubjectAndClassroom() {
    this.subjectId = this.subjectService.getItemFromStorage();
    if (!this.subjectId) {
      console.error("No se encontró el ID de la materia en el Storage.");
      return;
    }

    this.subject$ = this.subjectService.getSubjectById(this.subjectId);

    this.subject$.subscribe({
      next: (subjectData) => {
        document.documentElement.style.setProperty('--subject-color', subjectData.color);
        
        this.classroomId = subjectData.classroom_id!;
        
        this.loadCurrentClassroom(this.classroomId);
      },
      error: (err) => console.error("Error al obtener la materia: ", err)
    });
  }

  loadCurrentClassroom(classroomId: string) {
    this.classroomService.getClassroomById(classroomId).subscribe({
      next: (classroomData) => {
        this.currentClassroom = classroomData;
      },
      error: (err) => console.error("Error al obtener el aula virtual: ", err)
    });
  }

  onSubmit() {
    if (this.topicForm.invalid || !this.currentClassroom) return;

    const { title, content } = this.topicForm.value;

    this.newTopic = {
      title: title.trim(),
      content: content,
      classroom_id: this.classroomId!
    };

    this.submitTopic();
  }

  submitTopic() {
    const currentTopics = this.currentClassroom?.topics_id || [];

    this.topicService.createTopic(this.newTopic).subscribe({
      next: (createdTopic) => {
        const topicId = (createdTopic as Topic).id!;

        if (!currentTopics.includes(topicId)) {
          const updatedClassroom: Classroom = {
            ...this.currentClassroom!,
            topics_id: [...currentTopics, topicId]
          };

          this.updateClassroomTopics(updatedClassroom);
        } else {
          this.navigateToClassroom();
        }
      },
      error: (err) => console.error("Hubo un error al crear la sección: ", err)
    });
  }

  updateClassroomTopics(updatedClassroom: Classroom) {
    this.classroomService.modifyClassroom(updatedClassroom.id!, updatedClassroom).subscribe({
      next: () => {
        this.currentClassroom = updatedClassroom;
        alert("Sección Creada Exitosamente.");
        this.navigateToClassroom();
      },
      error: (err) => console.error("Hubo un error al asociar el tema al curso: ", err)
    });
  }

  navigateToClassroom() {
    this.router.navigate([`/current-classroom`, this.classroomId]);
  }

  switchMode(newMode: 'teorico' | 'entregable') {
    this.mode = newMode;
  }

  setFormat(newFormat: 'archivo' | 'carpeta' | 'texto') {
    this.assignmentFormat = newFormat;
  }
}
