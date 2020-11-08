import { TemperatureResult } from '@temperature-controller/api-interfaces';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Temperature() {
  const [temperature, setTemperature] = useState<number>();

  useEffect(() => {
    const socket = io({
      path: '/api/socket.io',
    });
    socket.on('temperature', ({ temperature }: TemperatureResult) => {
      setTemperature(temperature);
    });
  }, []);

  return <p>{temperature} C°</p>;
}
