import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Register } from './components/auth/register/register';
import { NotFound } from './components/not-found/not-found';
import { Groups } from './components/groups/groups';
import { Subjects } from './components/subjects/subjects';
import { Classroom } from './components/classroom/classroom';
import { Notifications } from './components/notifications/notifications';
import { PendingTasks } from './components/pending-tasks/pending-tasks';

export const routes: Routes = [
    { path: '', component: Home, pathMatch: 'full' },
    { path: 'home', component: Home },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'subjects', component: Subjects },
    { path: 'groups', component: Groups },
    { path: 'classrooms', component: Classroom },
    { path: 'notifications', component: Notifications },
    { path: 'pending-tasks', component: PendingTasks },
    { path: '**', component: NotFound }
];