import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ElysiaService {
  ws = new WebSocket(environment.server);
}
