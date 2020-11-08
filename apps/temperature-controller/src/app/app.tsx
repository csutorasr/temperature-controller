import React, { useEffect, useState } from 'react';
import {
  ChangeRequest,
  TemperatureResult,
} from '@temperature-controller/api-interfaces';

function setRelay(size: 'small' | 'big', on: boolean) {
  fetch(`/api/relay/${size}`, {
    method: 'POST',
    body: JSON.stringify({ on } as ChangeRequest),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
}

export const App = () => {
  const [temperature, setTemperature] = useState<TemperatureResult>({
    temperature: undefined,
  });

  useEffect(() => {
    fetch('/api/temperature')
      .then((r) => r.json())
      .then(setTemperature);
  }, []);

  return (
    <div>
      {temperature.temperature} C°
      <h2>small</h2>
      <button onClick={() => setRelay('small', true)}>On</button>
      <button onClick={() => setRelay('small', false)}>Off</button>
      <h2>big</h2>
      <button onClick={() => setRelay('big', true)}>On</button>
      <button onClick={() => setRelay('big', false)}>Off</button>
    </div>
  );
};

export default App;
