import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  inject,
  NgZone,
  OnInit,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterModule,
} from '@angular/router';
import { UiService } from './services/ui.service';
import { AuthService } from './services/auth.service';
import { User } from './models/user.model';
import { Role } from './models/roles';
import { LoadService } from './services/load.service';
import { LoadSpinner } from './components/load-spinner/load-spinner';
import { filter, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Notice } from './models/notice.model';
import { NoticeService } from './services/notice.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterModule, CommonModule, LoadSpinner],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('cursitu');

  private ngZone = inject(NgZone);

  noticeList$!: Observable<Notice[]>;
  unreadCount$!: Observable<number>;
  currentUser$!: Observable<User>;

  isSidebarOpen = false;

  constructor(
    public uiService: UiService,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loadService: LoadService,
    private noticeService: NoticeService,
    private userService: UserService,
  ) {}

  menuItems: any[] = [];

  ngOnInit() {
    this.authService.userRole$.subscribe((rol) => {
      this.buildMenu(rol);
    });

    this.authService.currentUser$
      .pipe(
        filter((user) => !!user && !!user.id),
        take(1),
        switchMap((authUser) => {
          return this.userService.getUserById(authUser?.id!);
        }),
      )
      .subscribe({
        next: (dbUser) => {
          this.currentUser$ = of(dbUser);

          this.getNotices(dbUser.id!);
        },
        error: (err) => {
          console.error('Error en la cadena de inicialización de usuario/avisos:', err);
        },
      });
  }

  setupLoader() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.ngZone.run(() => {
          this.loadService.show();
        });
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.ngZone.run(() => {
          this.loadService.hide();
        });
      }
    });
  }

  getNotices(userId: string): void {
    this.noticeList$ = this.noticeService.getAllNotices().pipe(
      map((notices: Notice[]) =>
        notices.map((notice) => ({
          ...notice,
          hasRead: notice.readBy ? notice.readBy.includes(userId) : false,
        })),
      ),
    );

    this.unreadCount$ = this.noticeList$.pipe(
      map((notices: Notice[]) => {
        if (!notices) return 0;

        return notices.filter((notice) => {
          const isUnread = !notice.hasRead;

          const isNotOwnNotice = notice.senderId !== userId;

          return isUnread && isNotOwnNotice;
        }).length;
      }),
    );

    this.cdr.detectChanges();
  }

  buildMenu(rol: Role) {
    const baseMenu = [
      { path: '/home', icon: 'home', label: 'Inicio' },
      { path: '/subjects', icon: 'widgets', label: 'Materias' },
    ];

    if (rol === 'DOCENTE') {
      this.menuItems = [
        ...baseMenu,
        { path: '/my-classes', icon: 'class', label: 'Gestión de Clases' },
        { path: '/reports', icon: 'analytics', label: 'Reportes' },
      ];
    } else {
      this.menuItems = [
        ...baseMenu,
        { path: '/groups', icon: 'group', label: 'Mis Grupos' },
        { path: '/pending-tasks', icon: 'grid_view', label: 'Tareas' },
      ];
    }
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.isDropdownOpen = false;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
