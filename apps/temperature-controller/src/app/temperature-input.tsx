import React, { useCallback, useMemo } from 'react';

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
    setTemperature(Math.round(temperature + 0.1));
  }, [setTemperature, temperature]);
  const minusTenths = useCallback(() => {
    setTemperature(Math.round(temperature - 0.1));
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
    <p>
      {title}
      <button onClick={minusTenths}>-0.1</button>
      <button onClick={plusTenths}>+0.1</button>
      <button onClick={minusUnits}>-1</button>
      <button onClick={plusUnits}>+1</button>
      <button onClick={minusTens}>-10</button>
      <button onClick={plusTens}>+10</button>
      {tens}
      {units}.{tenths} C°
    </p>
  );
}
