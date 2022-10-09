import { access, constants, writeFile } from 'fs';
import { promisify } from 'util';
import { environment } from '../../environments/environment';

const levelToPort = {
  [0]: 14,
  [1]: 16,
  [2]: 15,
};
export type Levels = keyof typeof levelToPort;

const accessAsync = promisify(access);
const writeFileAsync = promisify(writeFile);

const gpioPath = '/sys/class/gpio/gpio';
async function setGPIO(port: number, value: boolean) {
  if (!environment.production) {
    console.log(`Turn port ${port} ${value ? 'on' : 'off'}.`);
    return;
  }
  const portValuePath = `${gpioPath}${port}/value`;
  try {
    await accessAsync(portValuePath, constants.W_OK);
  } catch {
    throw new Error(`Port ${port} value is not writable for runner user.`);
  }
  await writeFileAsync(portValuePath, value ? '1' : '0');
}

export async function turnOnLevel(levelToTurnOn: Levels) {
  await turnOff();
  await new Promise(resolve => setTimeout(resolve, 500));
  for (const level in levelToPort) {
    if (Object.prototype.hasOwnProperty.call(levelToPort, level)) {
      const port = levelToPort[level];
      if (+level === levelToTurnOn) {
        await setGPIO(port, true);
      }
    }
  }
}
export async function turnOff() {
  for (const level in levelToPort) {
    if (Object.prototype.hasOwnProperty.call(levelToPort, level)) {
      const port = levelToPort[level];
      await setGPIO(port, false);
    }
  }
}
