import { addBackgroundJobCallback, JobResult } from './background-job';
import { changeBig, changeSmall } from './orangepi/relay';
import { settings } from './settings';

let lastOn: Date = new Date(0);
let lastOff: Date = new Date(0);

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
      await changeSmall(true);
      if (overLevel2) {
        await changeBig(true);
      } else if (underLevel2) {
        await changeBig(false);
      }
      lastOn = currentTime;
    }
  } else if (underLevel1) {
    if (nextOffTime < currentTime) {
      await changeBig(false);
      await changeSmall(false);
      lastOff = currentTime;
    }
  }
};
export function setupRelayController() {
  addBackgroundJobCallback(setRelays);
}
