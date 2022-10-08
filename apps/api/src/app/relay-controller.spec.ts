import { advanceTo, advanceBy, clear } from 'jest-date-mock';
import { JobResult } from './background-job';
import * as relay from './orangepi/relay';
import { forceInternalState, setupRelayController } from './relay-controller';
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
jest.mock('./orangepi/relay', () => ({
  turnOnLevel: jest.fn(),
  turnOff: jest.fn(),
}));
const turnOnLevel = <jest.Mock>relay.turnOnLevel;
const turnOff = <jest.Mock>relay.turnOff;

describe('Relay controller', () => {
  beforeAll(() => {
    advanceTo(new Date(2020, 0));
  });
  beforeEach(() => {
    turnOnLevel.mockResolvedValue(true);
    turnOff.mockResolvedValue(true);
    setupRelayController();
    advanceBy(60 * 60 * 1000);
  });
  it('should set up background job', () => {
    expect(callback).toBeDefined();
  });
  it('should not turn on under temperature', async () => {
    forceInternalState();
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 25 });
    expect(turnOnLevel).not.toHaveBeenCalledWith(true);
  });
  it('should turn off under temperature', async () => {
    forceInternalState(2);
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 25 });
    expect(turnOff).toHaveBeenCalledWith();
  });
  it('should not turn off under temperature if still off', async () => {
    forceInternalState();
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 25 });
    expect(turnOnLevel).not.toHaveBeenCalledWith(false);
  });

  it('should do nothing on level 1 hysteresis', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 44 });
    expect(turnOnLevel).not.toHaveBeenCalled();
  });

  it('should turn level 1 on at level 1 temperature', async () => {
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 45.1 });
    expect(turnOnLevel).toHaveBeenCalledWith(0);
  });

  it('should not change level 2 on at level 1 temperature', async () => {
    forceInternalState();
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 45.1 });
    expect(turnOnLevel).not.toHaveBeenCalledWith(1);
  });

  it('should turn level 2 on at level 2 temperature', async () => {
    forceInternalState(0);
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 55.1 });
    expect(turnOnLevel).toHaveBeenCalledWith(1);
    expect(turnOnLevel).not.toHaveBeenCalledWith(0);
  });

  it('should turn level 3 on at level 3 temperature', async () => {
    forceInternalState(0);
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 65.1 });
    expect(turnOnLevel).toHaveBeenCalledWith(2);
  });

  it('should wait for minimum on time', async () => {
    forceInternalState(0, 'setTime');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 40,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    advanceBy(30 * 1000);
    await callback({ temperature: 40 });
    expect(turnOff).not.toHaveBeenCalled();
    advanceBy(1000);
    await callback({ temperature: 40 });
    expect(turnOff).toHaveBeenCalled();
  });

  it('should wait for minimum off time', async () => {
    forceInternalState(undefined, 'setTime');
    settings = {
      minimumOnTime: 40,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    advanceBy(30 * 1000);
    await callback({ temperature: 45.1 });
    expect(turnOnLevel).not.toHaveBeenCalled();
    advanceBy(1);
    await callback({ temperature: 45.1 });
    expect(turnOnLevel).toHaveBeenLastCalledWith(0);
  });

  it('should use level 1 hysteresis', async () => {
    forceInternalState(0);
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 43 });
    expect(turnOnLevel).not.toHaveBeenCalled();
    await callback({ temperature: 42.9 });
    expect(turnOff).toHaveBeenCalled();
  });

  it('should use level 2 hysteresis', async () => {
    forceInternalState(1);
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 53 });
    expect(turnOnLevel).not.toHaveBeenCalledWith(1);
    await callback({ temperature: 52.9 });
    expect(turnOnLevel).toHaveBeenLastCalledWith(0);
  });

  it('should use level 3 hysteresis', async () => {
    forceInternalState(1);
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
      level3Temperature: 65,
    };
    await callback({ temperature: 63 });
    expect(turnOnLevel).not.toHaveBeenCalledWith(2);
    await callback({ temperature: 62.9 });
    expect(turnOnLevel).toHaveBeenLastCalledWith(1);
  });

  afterEach(() => {
    turnOnLevel.mockClear();
    turnOff.mockClear();
  });

  afterAll(() => {
    clear();
  });
});
