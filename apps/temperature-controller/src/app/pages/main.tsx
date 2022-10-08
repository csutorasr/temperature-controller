import React from 'react';
import Temperature from '../temperature';

function setRelay(level: 'off' | 'level1' | 'level2' | 'level3') {
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
      <button onClick={() => setRelay('off')} className="primary">Ki</button>
      <button onClick={() => setRelay('level1')} className="primary">1. szint</button>
      <button onClick={() => setRelay('level2')} className="primary">2. szint</button>
      <button onClick={() => setRelay('level3')} className="primary">3. szint</button>
    </div>
  );
};

export default Main;
