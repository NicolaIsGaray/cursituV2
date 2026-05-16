import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subject } from '../../models/subject.model';
import { SubjectService } from '../../services/subject.service';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-subjects',
  imports: [CommonModule, RouterModule],
  templateUrl: './subjects-list.html',
  styleUrls: ['./subjects-list.css'],
})
export class SubjectsList implements OnInit {
  subjectList$?: Observable<Subject[]>;

  constructor(
    private router: Router,
    public authService: AuthService,
    private subjectService: SubjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadUserSubjects();
  }

  loadUserSubjects() {
    const ids = this.authService.currentUserValue?.subjects_id;
    
    if (ids && ids.length > 0) {
      const requests = ids.map((id) => this.subjectService.getSubjectById(id).pipe(
        switchMap(subject => 
          this.userService.getUserById(subject.professor_id).pipe(
            map(prof => ({...subject, professorData: prof}))
          )
        )
      ));
      this.subjectList$ = forkJoin(requests);
      
    } else {
      this.subjectList$ = this.subjectService.getAllSubjects();
    }
  }

  navigateToClassroom(path: string, subjectId: string) {
    this.router.navigate([path, subjectId]);
  }

  navigateToPanel(path: string) {
    this.router.navigate([path])
  }
}
