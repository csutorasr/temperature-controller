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
  changeBig: jest.fn(),
  changeSmall: jest.fn(),
}));
const changeBig = <jest.Mock>relay.changeBig;
const changeSmall = <jest.Mock>relay.changeSmall;

describe('Relay controller', () => {
  beforeAll(() => {
    advanceTo(new Date(2020, 0));
  });
  beforeEach(() => {
    changeBig.mockResolvedValue(true);
    changeSmall.mockResolvedValue(true);
    setupRelayController();
    advanceBy(60 * 60 * 1000);
  });
  it('should set up background job', () => {
    expect(callback).toBeDefined();
  });
  it('should not turn on under temperature', async () => {
    forceInternalState('off');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 25 });
    expect(changeBig).not.toHaveBeenCalledWith(true);
    expect(changeSmall).not.toHaveBeenCalledWith(true);
  });
  it('should turn off under temperature', async () => {
    forceInternalState('level2');
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
  it('should not turn off under temperature if still off', async () => {
    forceInternalState('off');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 25 });
    expect(changeBig).not.toHaveBeenCalledWith(false);
    expect(changeSmall).not.toHaveBeenCalledWith(false);
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
    expect(changeSmall).toHaveBeenCalledWith(true);
  });

  it('should not change level 2 on at level 1 temperature', async () => {
    forceInternalState('off');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 45.1 });
    expect(changeBig).not.toHaveBeenCalled();
  });

  it('should turn level 2 on at level 2 temperature', async () => {
    forceInternalState('level1');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 55.1 });
    expect(changeBig).toHaveBeenCalledWith(true);
    expect(changeSmall).not.toHaveBeenCalled();
  });

  it('should wait for minimum on time', async () => {
    forceInternalState('level1', 'setTime');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 40,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    advanceBy(30 * 1000);
    await callback({ temperature: 40 });
    expect(changeSmall).not.toHaveBeenCalled();
    advanceBy(1);
    await callback({ temperature: 40 });
    expect(changeSmall).toHaveBeenLastCalledWith(false);
  });

  it('should wait for minimum off time', async () => {
    forceInternalState('off', 'setTime');
    settings = {
      minimumOnTime: 40,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    advanceBy(30 * 1000);
    await callback({ temperature: 45.1 });
    expect(changeSmall).not.toHaveBeenCalled();
    advanceBy(1);
    await callback({ temperature: 45.1 });
    expect(changeSmall).toHaveBeenLastCalledWith(true);
  });

  it('should use level 1 hysteresis', async () => {
    forceInternalState('level1');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 43 });
    expect(changeSmall).not.toHaveBeenCalled();
    await callback({ temperature: 42.9 });
    expect(changeSmall).toHaveBeenLastCalledWith(false);
  });

  it('should use level 2 hysteresis', async () => {
    forceInternalState('level2');
    settings = {
      minimumOnTime: 30,
      minimumOffTime: 30,
      hysteresis: 2,
      level1Temperature: 45,
      level2Temperature: 55,
    };
    await callback({ temperature: 53 });
    expect(changeBig).not.toHaveBeenCalled();
    await callback({ temperature: 52.9 });
    expect(changeBig).toHaveBeenLastCalledWith(false);
  });

  afterEach(() => {
    changeBig.mockClear();
    changeSmall.mockClear();
  });

  afterAll(() => {
    clear();
  });
});
