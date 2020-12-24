import React, { useMemo } from 'react';
import ThreeNumberInput, { ThreeNumberInputConfig } from './three-number-input';

const config: ThreeNumberInputConfig = {
  twoDivider: '.',
  unit: '°C',
};

export default function TemperatureInput({
  temperature,
  setTemperature,
  title,
}: {
  temperature: number;
  setTemperature: (temperature: number) => void;
  title: string;
}) {
  const one = useMemo(() => Math.floor(temperature / 10), [temperature]);
  const two = useMemo(() => Math.floor(temperature % 10), [temperature]);
  const three = useMemo(() => Math.floor((temperature * 10) % 10), [
    temperature,
  ]);
  return (
    <ThreeNumberInput
      config={config}
      title={title}
      value={{
        one,
        two,
        three,
      }}
      setValue={(one, two, three) => {
        const value = one * 10 + two + three * 0.1;
        if (value < 0) {
          setTemperature(0);
          return;
        }
        if (value > 99.9) {
          setTemperature(99.9);
          return;
        }
        setTemperature(value);
      }}
    />
  );
}
