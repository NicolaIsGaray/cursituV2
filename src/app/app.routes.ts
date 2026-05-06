import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { NotFound } from './components/not-found/not-found';
import { Groups } from './components/groups/groups';
import { SubjectsList } from './components/subject-list/subjects-list';
import { CurrentClassroom } from './components/classroom/current-classroom/current-classroom';
import { PendingTasks } from './components/classroom/pending-tasks/pending-tasks';
import { NoticesList } from './components/notices/notices-list/notices-list';
import { SendTask } from './components/classroom/send-task/send-task';
import { NoticeDetails } from './components/notices/notice-details/notice-details';
import { TransmissionLobby } from './components/transmissions/transmission-lobby/transmission-lobby';
import { TransmissionLive } from './components/transmissions/transmission-live/transmission-live';
import { ProfessorPanel } from './components/professor-only/professor-panel/professor-panel';
import { ManageGrades } from './components/professor-only/manage-grades/manage-grades';
import { AddClass } from './components/professor-only/add-class/add-class';
import { EditSubject } from './components/professor-only/edit-subject/edit-subject';
import { ManageDates } from './components/professor-only/manage-dates/manage-dates';
import { ManageTasks } from './components/professor-only/manage-tasks/manage-tasks';
import { SeeDeliveries } from './components/professor-only/see-deliveries/see-deliveries';
import { ManageFinals } from './components/professor-only/manage-finals/manage-finals';
import { StudentsList } from './components/students-list/students-list';
import { MyNotices } from './components/professor-only/my-notices/my-notices';
import { PageConfiguration } from './components/page-configuration/page-configuration';

export const routes: Routes = [
    { path: '', component: Home, pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'subjects', component: SubjectsList },
    { path: 'groups', component: Groups },
    { path: 'transmission-lobby', component: TransmissionLobby },
    { path: 'transmission-live', component: TransmissionLive },

    { path: 'professor-panel', component: ProfessorPanel },
    { path: 'manage-grades', component: ManageGrades },
    { path: 'add-class', component: AddClass },
    { path: 'edit-subject', component: EditSubject },
    { path: 'manage-dates', component: ManageDates },
    { path: 'manage-tasks', component: ManageTasks },
    { path: 'see-deliveries', component: SeeDeliveries },
    { path: 'manage-finals', component: ManageFinals },
    { path: 'students', component: StudentsList },
    { path: 'my-notices', component: MyNotices },

    { path: 'current-classroom', component: CurrentClassroom },
    { path: 'pending-tasks', component: PendingTasks },
    { path: 'send-task', component: SendTask },
    { path: 'notices', component: NoticesList },
    { path: 'notices/:id', component: NoticeDetails },
    { path: 'configuration', component: PageConfiguration },
    { path: '**', component: NotFound }
];