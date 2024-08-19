import { Routes } from '@angular/router';
import { ListenComponent } from './components/listen/listen.component';
import { SpeakComponent } from './components/speak/speak.component';

export const routes: Routes = [
  {
    path: 'listen',
    component: ListenComponent,
  },
  {
    path: 'speak',
    component: SpeakComponent,
  },
];
