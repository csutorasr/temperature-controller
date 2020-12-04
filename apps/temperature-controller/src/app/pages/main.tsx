import React from 'react';
import Temperature from '../temperature';

function setRelay(level: 'off' | 'level1' | 'level2') {
  fetch(`/api/relay/${level}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
  });
}

export const Main = () => {
  return (
    <div>
      <Temperature />
      <h2>relay</h2>
      <button onClick={() => setRelay('off')}>Off</button>
      <button onClick={() => setRelay('level1')}>Level1</button>
      <button onClick={() => setRelay('level2')}>Level2</button>
    </div>
  );
};

export default Main;
