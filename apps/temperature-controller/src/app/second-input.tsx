import React, { useMemo } from 'react';
import ThreeNumberInput, { ThreeNumberInputConfig } from './three-number-input';

const config: ThreeNumberInputConfig = {
  oneDivider: ':',
  unit: 's',
};

export default function SecondInput({
  second,
  setSecond,
  title,
}: {
  second: number;
  setSecond: (second: number) => void;
  title: string;
}) {
  const one = useMemo(() => Math.floor(second / 60), [second]);
  const two = useMemo(() => Math.floor((second % 60) / 10), [second]);
  const three = useMemo(() => Math.floor(second % 10), [second]);
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
        const value = one * 60 + two * 10 + three;
        if (value < 0) {
          setSecond(0);
          return;
        }
        if (value > 9 * 60 + 59) {
          setSecond(9 * 60 + 59);
          return;
        }
        setSecond(value);
      }}
    />
  );
}
