import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Subject } from '../../../models/subject.model';
import { AssignmentDTO } from '../../../models/dto/assignmentDTO';
import { SubjectService } from '../../../services/subject.service';
import { AssignmentService } from '../../../services/assignment.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-pending-tasks',
  imports: [CommonModule, RouterModule],
  templateUrl: './pending-tasks.html',
  styleUrl: './pending-tasks.css',
})
export class PendingTasks implements OnInit {
  subjectList$!: Observable<Subject[]>;

  selectedSubject!: Subject;
  userData!: User;

  pendingList$!: Observable<AssignmentDTO[]>;

  constructor(
    private location: Location,
    private cdr: ChangeDetectorRef,
    private subjectService: SubjectService,
    private assignmentService: AssignmentService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.currentUserValue!;

    this.loadSubjects();
  }

  loadSubjects() {
    this.subjectList$ = this.subjectService.getStudentSubjects(this.userData.id!);

    this.subjectList$.subscribe({
      next: (subjects) => {
        this.selectedSubject = subjects[0];
        this.switchGroupSubject(this.selectedSubject.id!);
      }
    })
  }
  
  loadPendings() {
    this.pendingList$ = this.assignmentService.getPendingAssignments(this.userData.id!);
  }

  switchGroupSubject(subjectId: string) {
    this.subjectService.getSubjectById(subjectId).subscribe({
      next: (subject) => {
        this.selectedSubject = subject;

        document.documentElement.style.setProperty('--subject-color', subject.color);

        this.cdr.detectChanges();
      },
      error: (err) => console.error('Hubo un problema al intentar obtener la materia: ', err),
    });
  }

  goBack() {
    this.location.back();
  }
}
