import React, { useCallback, useMemo } from 'react';
import Triangle from './triangle';
import './temperature-input.scss';

export default function TemperatureInput({
  temperature,
  setTemperature,
  title,
}: {
  temperature: number;
  setTemperature: (temperature: number) => void;
  title: string;
}) {
  const tens = useMemo(() => Math.floor((temperature / 10) % 10), [
    temperature,
  ]);
  const units = useMemo(() => Math.floor(temperature % 10), [temperature]);
  const tenths = useMemo(() => Math.floor((temperature * 10) % 10), [
    temperature,
  ]);
  const plusTenths = useCallback(() => {
    setTemperature(Math.round(temperature * 10 + 1) / 10);
  }, [setTemperature, temperature]);
  const minusTenths = useCallback(() => {
    setTemperature(Math.round(temperature * 10 - 1) / 10);
  }, [setTemperature, temperature]);
  const plusUnits = useCallback(() => {
    setTemperature(Math.round(temperature + 1));
  }, [setTemperature, temperature]);
  const minusUnits = useCallback(() => {
    setTemperature(Math.round(temperature - 1));
  }, [setTemperature, temperature]);
  const plusTens = useCallback(() => {
    setTemperature(Math.round(temperature + 10));
  }, [setTemperature, temperature]);
  const minusTens = useCallback(() => {
    setTemperature(Math.round(temperature - 10));
  }, [setTemperature, temperature]);
  return (
    <p className="temperature-input">
      <span className="title">{title}</span>
      <span className="celsius">°C</span>
      <span className="dot">.</span>
      <button onClick={plusTens} style={{ gridArea: 'plus10' }}>
        <Triangle direction="up" />
      </button>
      <button onClick={plusUnits} style={{ gridArea: 'plus1' }}>
        <Triangle direction="up" />
      </button>
      <button onClick={plusTenths} style={{ gridArea: 'plus01' }}>
        <Triangle direction="up" />
      </button>
      <span style={{ gridArea: 'number10' }}>{tens}</span>
      <span style={{ gridArea: 'number1' }}>{units}</span>
      <span style={{ gridArea: 'number01' }}>{tenths}</span>
      <button onClick={minusTens} style={{ gridArea: 'minus10' }}>
        <Triangle direction="down" />
      </button>
      <button onClick={minusUnits} style={{ gridArea: 'minus1' }}>
        <Triangle direction="down" />
      </button>
      <button onClick={minusTenths} style={{ gridArea: 'minus01' }}>
        <Triangle direction="down" />
      </button>
    </p>
  );
}
