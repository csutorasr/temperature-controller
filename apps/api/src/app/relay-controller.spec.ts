import { advanceTo, advanceBy, clear } from 'jest-date-mock';
import { JobResult } from './background-job';
import { setupRelayController } from './relay-controller';
import { Configuration } from './settings';

let callback: ({ temperature }: JobResult) => Promise<void>;
jest.mock('./background-job', () => {
  return {
    addBackgroundJobCallback: (func) => (callback = func),
  };
});
let settings: Configuration;
jest.mock('./settings', () => {
  const obj = {};
  Object.defineProperty(obj, 'settings', {
    get: () => settings,
  });
  return obj;
});
let changeBig: jest.Mock, changeSmall: jest.Mock;
jest.mock('./orangepi/relay', () => {
  const obj = {};
  Object.defineProperty(obj, 'changeBig', {
    get: () => changeBig,
  });
  Object.defineProperty(obj, 'changeSmall', {
    get: () => changeSmall,
  });
  return obj;
});

describe('Relay controller', () => {
  beforeAll(() => {
    advanceTo(new Date(2020, 0));
  });
  beforeEach(() => {
    changeBig = jest.fn().mockResolvedValue(true);
    changeSmall = jest.fn().mockResolvedValue(true);
    setupRelayController();
    advanceBy(60 * 60 * 1000);
  });
  it('should set up background job', () => {
    expect(callback).toBeDefined();
  });
  it('should turn off under temperature', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 25 });
    expect(changeBig).toHaveBeenCalledWith(false);
    expect(changeSmall).toHaveBeenCalledWith(false);
  });

  it('should do nothing on level 1 hysteresis', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 44 });
    expect(changeBig).not.toHaveBeenCalled();
    expect(changeSmall).not.toHaveBeenCalled();
  });

  it('should turn level 1 on at level 1 temperature', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 45.1 });
    expect(changeBig).toHaveBeenCalledWith(false);
    expect(changeSmall).toHaveBeenCalledWith(true);
  });

  it('should turn level 2 on at level 2 temperature', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 55.1 });
    expect(changeBig).toHaveBeenCalledWith(true);
    expect(changeSmall).toHaveBeenCalledWith(true);
  });

  it('should wait for minimum on time', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 40,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 45.1 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(true);
    expect(changeBig).toHaveBeenCalledTimes(1);
    expect(changeSmall).toHaveBeenCalledTimes(1);
    advanceBy(30 * 1000);
    await callback({ temperature: 40 });
    expect(changeBig).toHaveBeenCalledTimes(1);
    expect(changeSmall).toHaveBeenCalledTimes(1);
    advanceBy(1);
    await callback({ temperature: 40 });
    expect(changeBig).toHaveBeenCalledTimes(2);
    expect(changeSmall).toHaveBeenCalledTimes(2);
    expect(changeBig).toHaveBeenCalledWith(false);
    expect(changeSmall).toHaveBeenCalledWith(false);
  });

  it('should wait for minimum off time', async () => {
    settings = {
      minimumOnTime: 40,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 25 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(false);
    expect(changeBig).toHaveBeenCalledTimes(1);
    expect(changeSmall).toHaveBeenCalledTimes(1);
    advanceBy(30 * 1000);
    await callback({ temperature: 45.1 });
    expect(changeBig).toHaveBeenCalledTimes(1);
    expect(changeSmall).toHaveBeenCalledTimes(1);
    advanceBy(1);
    await callback({ temperature: 45.1 });
    expect(changeBig).toHaveBeenCalledTimes(2);
    expect(changeSmall).toHaveBeenCalledTimes(2);
    expect(changeBig).toHaveBeenCalledWith(false);
    expect(changeSmall).toHaveBeenCalledWith(false);
  });

  it('should use level 1 hysteresis', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 25 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(false);
    expect(changeBig).toHaveBeenCalledTimes(1);
    expect(changeSmall).toHaveBeenCalledTimes(1);
    advanceBy(30 * 1000 + 1);
    await callback({ temperature: 45.1 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(true);
    advanceBy(30 * 1000 + 1);
    await callback({ temperature: 43 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(true);
    await callback({ temperature: 42.9 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(false);
  });

  it('should use level 2 hysteresis', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 55 });
    expect(changeBig).not.toHaveBeenCalled();
    expect(changeSmall).toHaveBeenLastCalledWith(true);
    advanceBy(30 * 1000 + 1);
    await callback({ temperature: 55.1 });
    expect(changeBig).toHaveBeenLastCalledWith(true);
    expect(changeSmall).toHaveBeenLastCalledWith(true);
    advanceBy(30 * 1000 + 1);
    await callback({ temperature: 53 });
    expect(changeBig).toHaveBeenLastCalledWith(true);
    expect(changeSmall).toHaveBeenLastCalledWith(true);
    await callback({ temperature: 52.9 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
    expect(changeSmall).toHaveBeenLastCalledWith(true);
  });

  afterEach(() => {
    changeBig.mockClear();
    changeSmall.mockClear();
  });

  afterAll(() => {
    clear();
  });
});
