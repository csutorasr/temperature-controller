import { getTemperature } from './orangepi/temperature';

export interface JobResult {
  temperature: number;
}
type JobCallback = (jobResult: JobResult) => void;

let interval: NodeJS.Timer;

const listeners: JobCallback[] = [];

export function startBackgroundJob(intervalInSeconds = 5000) {
  stopBackgroundJob();
  interval = setInterval(async () => {
    const temperature = await getTemperature();
    const data: JobResult = {
      temperature,
    };
    listeners.forEach((callback) => callback(data));
  }, intervalInSeconds);
}

export function stopBackgroundJob() {
  if (interval !== undefined) {
    clearInterval(interval);
  }
}

export function addBackgroundJobCallback(callback: JobCallback) {
  listeners.push(callback);
}

export function removeBackgroundJobCallback(callback: JobCallback) {
  const index = listeners.indexOf(callback);
  if (index > -1) {
    listeners.splice(index, 1);
  }
}
