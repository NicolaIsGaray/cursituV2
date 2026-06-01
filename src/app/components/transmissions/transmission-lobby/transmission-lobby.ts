import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subject } from '../../../models/subject.model';
import { Group } from '../../../models/group.model';
import { SubjectService } from '../../../services/subject.service';
import { User } from '../../../models/user.model';
import { GroupService } from '../../../services/group.service';

@Component({
  selector: 'app-transmission-lobby',
  imports: [CommonModule, RouterModule],
  templateUrl: './transmission-lobby.html',
  styleUrl: './transmission-lobby.css',
})
export class TransmissionLobby implements OnInit {
  subjects: Subject[] = [];
  activeSubject: Subject | null = null;
  // Añadimos 'resultadoSorteo' como propiedad opcional temporal para la UI del sorteo
  activeSubjectGroups: (Group & { resultadoSorteo?: string })[] = [];
  metodo: 'orden' | 'sorteo' | null = null;

  userData!: User;

  constructor(
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private subjectService: SubjectService,
    private groupService: GroupService,
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.currentUserValue!;
    this.loadProfessorSubjects();
  }

  loadProfessorSubjects(): void {
    this.subjectService.getProfessorSubjects(this.userData.id!).subscribe({
      next: (data) => {
        this.subjects = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando materias', err),
    });
  }

  onSubjectChange(event: any): void {
    const subjectId = event.target.value;
    const selected = this.subjects.find((s) => s.id === subjectId);

    if (selected) {
      this.activeSubject = selected;
      this.metodo = null;

      this.groupService.getGroupsInSubject(subjectId).subscribe({
        next: (groups) => {
          // Si el backend devuelve grupos nuevos sin 'order' definido (ej: 0 o null),
          // le asignamos uno secuencial por defecto, respetando el orden que ya traigan los demás.
          this.activeSubjectGroups = groups.map((g, index) => ({
            ...g,
            order: g.order ? g.order : index + 1,
          }));

          // Ordenamos el array local de forma ascendente según su 'order' persistido
          this.sortGroupsByOrder();

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar los grupos de la materia', err);
          this.activeSubjectGroups = [];
        },
      });
    }
  }

  updateGroupOrder(groupId: string, event: any): void {
    const newOrder = parseInt(event.target.value, 10);
    const grupo = this.activeSubjectGroups.find((g) => g.id === groupId);
    if (grupo) {
      grupo.order = newOrder;
    }
  }

  executeDraw(): void {
    if (this.activeSubjectGroups.length === 0) return;

    // Generamos las prioridades numéricas de los turnos de manera limpia basados en el total de grupos
    const totalGrupos = this.activeSubjectGroups.length;
    const turnos = Array.from({ length: totalGrupos }, (_, i) => i + 1);

    // Algoritmo Fisher-Yates para mezclar el array secuencial de turnos
    for (let i = turnos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [turnos[i], turnos[j]] = [turnos[j], turnos[i]];
    }

    // Impactamos el resultado directamente tanto en el atributo nativo 'order' como en el tag visual
    this.activeSubjectGroups.forEach((grupo, idx) => {
      grupo.order = turnos[idx];
      grupo.resultadoSorteo = `${turnos[idx]}° Turno`;
    });

    // Re-ordenamos la lista local automáticamente para que refleje visualmente la jerarquía del sorteo
    this.sortGroupsByOrder();
    this.cdr.detectChanges();
  }

  saveConfig(): void {
    if (this.activeSubjectGroups.length === 0) return;

    const payload = this.activeSubjectGroups.map((g) => ({
      id: g.id!,
      order: g.order || 0,
    }));

    this.groupService.updateGroupsOrder(payload).subscribe({
      next: () => {
        alert('Orden de exposición y estados actualizados correctamente.');

        // Sincronizamos el estado local con la misma regla del backend
        this.activeSubjectGroups.forEach((grupo) => {
          if (grupo.order === 1) {
            grupo.status = 'TRANSMITTING';
          } else {
            grupo.status = 'WAITING';
          }
        });

        // Ordenamos visualmente la lista por posición secuencial
        this.sortGroupsByOrder();

        // Notificamos a Angular para que pinte los badges semánticos en tiempo real
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar la configuración de orden:', err);
        alert('Ocurrió un error al intentar persistir el orden.');
      },
    });
  }

  private sortGroupsByOrder(): void {
    this.activeSubjectGroups.sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  goBack(): void {
    window.history.back();
  }
}
