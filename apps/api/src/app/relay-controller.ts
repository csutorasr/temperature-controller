import { addBackgroundJobCallback, JobResult } from './background-job';
import { Levels, turnOff, turnOnLevel } from './orangepi/relay';
import { settings } from './settings';

const internalState: { lastLevel?: Levels; lastOn: Date; lastOff: Date } = {
  lastLevel: undefined,
  lastOn: new Date(0),
  lastOff: new Date(0),
};

const setRelays = async ({ temperature }: JobResult): Promise<void> => {
  const overLevel1 = temperature > settings.level1Temperature;
  const underLevel1 =
    temperature < settings.level1Temperature - settings.hysteresis;
  const overLevel2 = temperature > settings.level2Temperature;
  const underLevel2 =
    temperature < settings.level2Temperature - settings.hysteresis;
  const overLevel3 = temperature > settings.level3Temperature;
  const underLevel3 =
    temperature < settings.level3Temperature - settings.hysteresis;
  const currentTime = new Date();
  const nextOnTime = new Date(internalState.lastOff);
  nextOnTime.setSeconds(
    internalState.lastOff.getSeconds() + settings.minimumOffTime
  );
  const nextOffTime = new Date(internalState.lastOn);
  nextOffTime.setSeconds(
    internalState.lastOn.getSeconds() + settings.minimumOnTime
  );
  if (overLevel1) {
    if (nextOnTime < currentTime) {
      if (overLevel3) {
        await turnOnLevel(2);
      }
      if (overLevel2 && underLevel3) {
        await turnOnLevel(1);
      }
      if (underLevel2) {
        await turnOnLevel(0);
      }
      internalState.lastOn = currentTime;
    }
  } else if (underLevel1) {
    if (nextOffTime < currentTime) {
      await turnOff();
      internalState.lastOff = currentTime;
    }
  }
};
export function setupRelayController() {
  addBackgroundJobCallback(setRelays);
}

export function forceInternalState(
  level?: Levels | undefined,
  time: 'setTime' | 'notSetTime' = 'notSetTime'
) {
  internalState.lastLevel = level;
  if (time === 'setTime') {
    internalState.lastOff = new Date();
    internalState.lastOn = new Date();
  }
}
