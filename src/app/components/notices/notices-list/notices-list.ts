import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { map, Observable, of, switchMap } from 'rxjs';
import { Notice } from '../../../models/notice.model';
import { NoticeService } from '../../../services/notice.service';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-notices',
  imports: [CommonModule, RouterModule],
  templateUrl: './notices-list.html',
  styleUrl: '../notices.css',
})
export class NoticesList implements OnInit {
  noticeList$!: Observable<Notice[]>;
  hasProfessor$!: Observable<boolean>;
  sendersList$!: Observable<User[]>;

  userData!: User;

  constructor(
    private router: Router,
    private location: Location,
    private authService: AuthService,
    private noticeService: NoticeService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.currentUserValue!;

    this.loadNotices();
  }

  loadNotices() {
    const currentUserId = this.userData.id!;
    const currentUserRole = this.userData.role;

    this.noticeList$ = this.noticeService.getAllNotices().pipe(
      switchMap((notices: Notice[]) => {
        if (!notices || notices.length === 0) {
          return of([]);
        }

        const senderIds = [...new Set(notices.map((n) => n.senderId))];

        return this.userService.getAllById(senderIds).pipe(
          map((senders: User[]) => {
            this.sendersList$ = of(senders);

            const senderRoleMap = new Map<string, string>(
              senders.map((user) => [user.id!, user.role]),
            );

            return notices
              .map((notice) => ({
                ...notice,
                hasRead: notice.readBy ? notice.readBy.includes(currentUserId) : false,
              }))
              .filter((notice) => {
                // REGLA PARA ALUMNOS: Pasan todos los avisos sin restricciones
                if (currentUserRole === 'ALUMNO') {
                  return true;
                }

                // REGLA PARA DOCENTES (Y otros roles):
                const senderRole = senderRoleMap.get(notice.senderId);

                const isNotOwnNotice = notice.senderId !== currentUserId;
                const isNotFromAnotherProfessor = senderRole !== 'DOCENTE';

                return isNotOwnNotice && isNotFromAnotherProfessor;
              });
          }),
        );
      }),
    );
  }

  seeNotice(id: string) {
    this.router.navigate(['/notices', id]);
  }

  goBack() {
    this.location.back();
  }
}
