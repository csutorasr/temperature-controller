import { access, constants, readFile } from 'fs';
import { promisify } from 'util';

const accessAsync = promisify(access);
const readFileAsync = promisify(readFile);

const masterPath = '/sys/bus/w1/devices/w1_bus_master1';
const masterSlavePath = `${masterPath}/w1_master_slaves`;
export async function getTemperature() {
  try {
    await accessAsync(masterSlavePath, constants.R_OK);
  } catch {
    throw new Error('No one wire bus is found');
  }
  const slaves = (await readFileAsync(masterSlavePath))
    .toString()
    .split('\n')
    .map((x) => x.trim())
    .filter((x) => !!x);
  if (slaves.length === 0) {
    throw new Error('No sernsor is found');
  }
  if (slaves.length !== 1) {
    throw new Error('More sernsors are found');
  }
  const slaveId = slaves[0];
  const slavePath = `${masterPath}/${slaveId}/temperature`;
  try {
    await accessAsync(slavePath, constants.R_OK);
  } catch {
    throw new Error('No temperature file is found');
  }
  const temperatureInThousands = await readFileAsync(slavePath);
  return +temperatureInThousands / 1000;
}
