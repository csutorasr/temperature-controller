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
      <button onClick={() => setRelay('off')} className="primary">Off</button>
      <button onClick={() => setRelay('level1')} className="primary">Level1</button>
      <button onClick={() => setRelay('level2')} className="primary">Level2</button>
    </div>
  );
};

export default Main;
