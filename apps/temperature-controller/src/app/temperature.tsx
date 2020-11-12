import { TemperatureResult } from '@temperature-controller/api-interfaces';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Temperature() {
  const [temperature, setTemperature] = useState<number>();

  useEffect(() => {
    const socket = io({
      path: '/api/socket.io',
    });
    const onTemperature = ({ temperature }: TemperatureResult) => {
      setTemperature(temperature);
    };
    socket.on('temperature', onTemperature);
    return () => {
      socket.off('temperature', onTemperature);
    };
  }, []);

  return <p>{temperature} C°</p>;
}
