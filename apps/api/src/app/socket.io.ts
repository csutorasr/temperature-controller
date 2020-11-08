import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { TemperatureResult } from '@temperature-controller/api-interfaces';
import { addBackgroundJobCallback } from './background-job';
import { temperatureCache } from './temperature-cache';

export function setupSocketIO(server: HttpServer) {
  const io = new Server(server, {
    path: '/api/socket.io',
  });
  io.on('connection', (socket: Socket) => {
    socket.emit('temperature', {
      temperature: temperatureCache,
    } as TemperatureResult);
  });
  addBackgroundJobCallback(({ temperature }) =>
    io.emit('temperature', { temperature } as TemperatureResult)
  );
}
