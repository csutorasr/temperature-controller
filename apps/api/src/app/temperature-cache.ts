import { addBackgroundJobCallback } from './background-job';

export let temperatureCache: number;

export function setupTemperatureCache() {
  addBackgroundJobCallback(
    ({ temperature }) => (temperatureCache = temperature)
  );
}
