import { io } from 'socket.io-client';
import { Socket } from 'socket.io-client/build/socket';

let instance: Socket = null;
let count = 0;

export function getSocket() {
  if (instance === null) {
    instance = io({
      path: '/api/socket.io',
    });
  }
  count++;
  return instance;
}

export function releaseSocket() {
  count--;
  if (count === 0) {
    instance.disconnect();
    instance = null;
  }
}
