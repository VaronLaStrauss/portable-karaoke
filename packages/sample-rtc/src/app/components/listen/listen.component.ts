import { Component } from '@angular/core';
import { ElysiaService } from '../../services/elysia.service';
import type { CallHandshake, SocketRes } from '../../utils/types';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { adjustPacketizationInterval, setCodecToOpus } from '../../utils';

@Component({
  selector: 'app-listen',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatListModule, MatButtonModule],
  templateUrl: './listen.component.html',
  styleUrl: './listen.component.scss',
})
export class ListenComponent {
  connections: Record<
    string,
    {
      peerConnection: RTCPeerConnection;
      mediaStream: MediaStream;
      name: string;
      ip?: string | null;
    }
  > = {};

  toRemove = new Set<string>();

  constructor(private eden: ElysiaService) {
    this.eden.ws.onmessage = (ev) => {
      const res = JSON.parse(ev.data) as SocketRes;
      if (res.message.type !== 'client') {
        return;
      }
      if ('offer' in res.message) {
        this.receiveOffer(res.id, res.message.name, res.message.offer);
      }
      if ('candidate' in res.message) {
        this.receiveCandidate(res.id, res.message.candidate);
      }
    };
  }

  async receiveOffer(id: string, name: string, handshake: CallHandshake) {
    if (!!this.connections[id]) return;

    const peerConnection = new RTCPeerConnection({
      iceTransportPolicy: 'all',
      rtcpMuxPolicy: 'require',
      bundlePolicy: 'max-bundle',
    });
    peerConnection.addTransceiver('audio', {
      direction: 'recvonly',
    });
    const mediaStream = new MediaStream();

    peerConnection.ontrack = (ev) => {
      mediaStream.addTrack(ev.track);
    };

    this.connections[id] = { peerConnection, mediaStream, name };

    peerConnection.onicecandidate = (ev) => {
      const { candidate } = ev;
      if (!candidate) return;
      this.connections[id].ip = candidate.address;
      this.eden.ws.send(JSON.stringify({ type: 'server', candidate }));
    };

    await peerConnection.setRemoteDescription(handshake);

    const { type, ...rest } = await peerConnection.createAnswer();

    let { sdp } = rest;
    sdp = setCodecToOpus(adjustPacketizationInterval(sdp!));
    await peerConnection.setLocalDescription({ sdp, type });

    this.sendAnswer(id, { sdp, type });
  }

  async receiveCandidate(id: string, init: RTCIceCandidateInit) {
    const connection = this.connections[id];
    if (!connection || !!connection.peerConnection.currentRemoteDescription)
      return;
    const candidate = new RTCIceCandidate(init);
    await connection.peerConnection.addIceCandidate(candidate);
  }

  sendAnswer(id: string, answer: RTCSessionDescriptionInit) {
    this.eden.ws.send(JSON.stringify({ type: 'server', answer, id }));
  }

  changeToRemove(item: MatSelectionListChange) {
    this.toRemove.clear();
    [...item.source.selectedOptions.selected.values()]
      .map((v) => v.value as string)
      .forEach((key) => {
        this.toRemove.add(key);
      });
  }

  removeSelected() {
    for (const key of this.toRemove) {
      const connection = this.connections[key];
      if (!connection) continue;
      const { mediaStream, peerConnection } = connection;
      peerConnection.close();
      mediaStream.getTracks().forEach((track) => track.stop());
      delete this.connections[key];
    }

    this.toRemove.clear();
  }

  get noCallers() {
    return !Object.keys(this.connections).length;
  }
}
