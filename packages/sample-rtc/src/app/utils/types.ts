export type CallHandshake = { sdp: string; type: 'offer' };

export type SocketRes = {
  id: string;
  message: SocketData;
};

export type SocketData = {
  type: 'client' | 'server';
  name: string;
} & (
  | {
      offer: CallHandshake;
    }
  | {
      answer: CallHandshake;
    }
  | {
      candidate: RTCIceCandidateInit;
    }
);
