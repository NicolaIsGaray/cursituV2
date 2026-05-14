import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { Subject } from '../../models/subject.model';
import { Group } from '../../models/group.model';
import { SubjectService } from '../../services/subject.service';
import { GroupService } from '../../services/group.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-groups',
  imports: [CommonModule, RouterModule],
  templateUrl: './groups.html',
  styleUrl: './groups.css',
})
export class Groups implements OnInit {
  subjectList$?: Observable<Subject[]>;
  groupList?: Group[];
  members?: User[];
  selectedSubject?: Subject;

  ngOnInit(): void {
    this.loadGroupSubjects()
  }

  loadGroupSubjects() {
    const ids = this.authService.currentUser?.subjects_id;

    if (ids && ids.length > 0) {
      const requests = ids.map((id) => this.subjectService.getSubjectById(id));

      this.subjectList$ = forkJoin(requests);
      this.getAllGroups();
    }
  }

  loadGroupMembers() {
  const ids = this.groupList?.flatMap(g => g.members_id) || [];
  const uniqueIds = [...new Set(ids)];

  if (uniqueIds.length > 0) {
    const requests = uniqueIds.map(id => this.userService.getUserById(id));
    
    forkJoin(requests).subscribe({
      next: (data) => {
        this.members = data;
      },
      error: (err) => console.error(err)
    })
  }
}

  getAllGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (data) => {
        this.groupList = data;
        this.loadGroupMembers()
      },
      error: (err) => console.error(err)
    })
  }

  getSelectedSubject(id: string) {
    this.subjectService.getSubjectById(id).subscribe({
      next: (data) => {
        this.selectedSubject = data;
      },
      error: (err) => console.error(err)
    })
  }

  constructor(
    public authService: AuthService,
    private subjectService: SubjectService,
    private groupService: GroupService,
    private userService: UserService
  ) {}
}
