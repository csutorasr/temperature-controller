import React from 'react';
import Triangle from './triangle';
import './three-number-input.scss';

export interface ThreeNumberInputConfig {
  oneDivider?: string;
  twoDivider?: string;
  unit: string;
}

export default function ThreeNumberInput({
  value,
  setValue,
  title,
  config,
}: {
  value: {
    one: number;
    two: number;
    three: number;
  };
  setValue: (one: number, two: number, three: number) => void;
  title: string;
  config: ThreeNumberInputConfig;
}) {
  const { one, two, three } = value;
  return (
    <p className="temperature-input">
      <span className="title">{title}</span>
      <span className="unit">{config.unit}</span>
      <span className="oneDivider">{config.oneDivider}</span>
      <span className="twoDivider">{config.twoDivider}</span>
      <button
        onClick={() => setValue(one + 1, two, three)}
        style={{ gridArea: 'plus10' }}
      >
        <Triangle direction="up" />
      </button>
      <button
        onClick={() => setValue(one, two + 1, three)}
        style={{ gridArea: 'plus1' }}
      >
        <Triangle direction="up" />
      </button>
      <button
        onClick={() => setValue(one, two, three + 1)}
        style={{ gridArea: 'plus01' }}
      >
        <Triangle direction="up" />
      </button>
      <span style={{ gridArea: 'number10' }}>{one}</span>
      <span style={{ gridArea: 'number1' }}>{two}</span>
      <span style={{ gridArea: 'number01' }}>{three}</span>
      <button
        onClick={() => setValue(one - 1, two, three)}
        style={{ gridArea: 'minus10' }}
      >
        <Triangle direction="down" />
      </button>
      <button
        onClick={() => setValue(one, two - 1, three)}
        style={{ gridArea: 'minus1' }}
      >
        <Triangle direction="down" />
      </button>
      <button
        onClick={() => setValue(one, two, three - 1)}
        style={{ gridArea: 'minus01' }}
      >
        <Triangle direction="down" />
      </button>
    </p>
  );
}
