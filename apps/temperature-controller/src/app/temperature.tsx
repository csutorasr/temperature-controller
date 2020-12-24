import { TemperatureResult } from '@temperature-controller/api-interfaces';
import React, { useEffect, useState } from 'react';
import { getSocket, releaseSocket } from './socket';
import './temperature.scss';

export default function Temperature() {
  const [temperature, setTemperature] = useState<number>();

  useEffect(() => {
    const socket = getSocket();
    const onTemperature = ({ temperature }: TemperatureResult) => {
      setTemperature(temperature);
    };
    socket.on('temperature', onTemperature);
    return () => {
      socket.off('temperature', onTemperature);
      releaseSocket();
    };
  }, []);

  return <p className="temperature">{temperature} C°</p>;
}
