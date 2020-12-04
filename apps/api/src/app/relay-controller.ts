import { addBackgroundJobCallback, JobResult } from './background-job';
import { changeBig, changeSmall } from './orangepi/relay';
import { settings } from './settings';

let lastOn: Date = new Date(0);
let lastOff: Date = new Date(0);

// This is required for not to override the manually set values.
const internalState = {
  big: false,
  small: false,
};
const functionMap = {
  small: changeSmall,
  big: changeBig,
};

const turn = async (
  type: 'small' | 'big',
  value: 'on' | 'off',
  callback?: () => void
) => {
  if (value === 'on' && !internalState[type]) {
    await functionMap[type](true);
    internalState[type] = true;
    if (callback) {
      callback();
    }
  }
  if (value === 'off' && internalState[type]) {
    await functionMap[type](false);
    internalState[type] = false;
    if (callback) {
      callback();
    }
  }
};

const setRelays = async ({ temperature }: JobResult): Promise<void> => {
  const overLevel1 = temperature > settings.level1Temperature;
  const underLevel1 =
    temperature < settings.level1Temperature - settings.hysteresis;
  const overLevel2 = temperature > settings.level2Temperature;
  const underLevel2 =
    temperature < settings.level2Temperature - settings.hysteresis;
  const currentTime = new Date();
  const nextOnTime = new Date(lastOff);
  nextOnTime.setSeconds(lastOff.getSeconds() + settings.minimumOffTime);
  const nextOffTime = new Date(lastOn);
  nextOffTime.setSeconds(lastOn.getSeconds() + settings.minimumOnTime);
  if (overLevel1) {
    if (nextOnTime < currentTime) {
      await turn('small', 'on');
      if (overLevel2) {
        await turn('big', 'on');
      } else if (underLevel2) {
        await turn('big', 'off');
      }
      lastOn = currentTime;
    }
  } else if (underLevel1) {
    if (nextOffTime < currentTime) {
      await turn('big', 'off');
      await turn('small', 'off', () => {
        lastOff = currentTime;
      });
    }
  }
};
export function setupRelayController() {
  addBackgroundJobCallback(setRelays);
}

export function forceInternalState(
  level: 'off' | 'level1' | 'level2',
  time: 'setTime' | 'notSetTime' = 'notSetTime'
) {
  internalState.small = level === 'level1' || level === 'level2';
  internalState.big = level === 'level2';
  if (time === 'setTime') {
    if (level === 'off') {
      lastOff = new Date();
    } else {
      lastOn = new Date();
    }
  }
}
