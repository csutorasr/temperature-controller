import { access, constants, writeFile } from 'fs';
import { promisify } from 'util';
import { environment } from '../../environments/environment';

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

export async function changeSmall(on: boolean) {
  return await setGPIO(14, on);
}
export async function changeBig(on: boolean) {
  return await setGPIO(16, on);
}
