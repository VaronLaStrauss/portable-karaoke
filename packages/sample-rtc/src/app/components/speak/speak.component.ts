import { Component, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ElysiaService } from '../../services/elysia.service';
import { CallHandshake, SocketRes } from '../../utils/types';
import { resolver } from '../../utils';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-speak',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './speak.component.html',
  styleUrl: './speak.component.scss',
})
export class SpeakComponent {
  muted = signal(true);
  connected = signal(false);

  audioStream!: MediaStream;
  peerConnection = new RTCPeerConnection();

  name = new FormControl('');

  constructor(
    private sb: MatSnackBar,
    private eden: ElysiaService,
  ) {
    this.eden.ws.onmessage = (ev) => {
      const res = JSON.parse(ev.data) as SocketRes;
      if (res.message.type !== 'server') {
        return;
      }
      if ('answer' in res.message) {
        this.receiveAnswer(res.message.answer);
      }
      if ('candidate' in res.message) {
        this.receiveCandidate(res.message.candidate);
      }
    };
  }

  async receiveAnswer(handshake: CallHandshake) {
    if (!!this.peerConnection.currentRemoteDescription) return;

    const answer = new RTCSessionDescription(handshake);
    await this.peerConnection.setRemoteDescription(answer);

    this.connected.set(true);
    this.toggleMic();
  }

  async receiveCandidate(init: RTCIceCandidateInit) {
    const candidate = new RTCIceCandidate(init);
    await this.peerConnection.addIceCandidate(candidate);
  }

  toggleMic() {
    if (this.muted()) {
      this.audioTrack.enabled = true;
      this.muted.set(false);
      return;
    }

    this.muted.set(true);
    this.audioTrack.enabled = false;
  }

  async connect() {
    this.peerConnection.onicecandidate = (ev) => {
      const { candidate } = ev;
      if (!candidate) return;
      this.eden.ws.send(JSON.stringify({ type: 'client', candidate }));
    };

    const [audioStream, err] = await resolver(
      navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      }),
    );
    if (err || !audioStream) {
      this.sb.open('Please enable your microphone', 'Ok');
      return;
    }

    this.audioStream = audioStream;
    this.audioTrack.enabled = false;

    audioStream.getTracks().forEach((track) => {
      this.peerConnection.addTrack(track, audioStream);
    });

    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);

    this.eden.ws.send(
      JSON.stringify({ type: 'client', offer, name: this.name.value }),
    );

    this.name.disable();
  }

  get audioTrack() {
    return this.audioStream.getTracks()[0];
  }
}
