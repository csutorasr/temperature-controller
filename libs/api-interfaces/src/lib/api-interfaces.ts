export interface TemperatureResult {
  temperature: number;
}

export interface ChangeRequest {
  on: boolean;
}

export interface ConfigurationResult {
  minimumOnTime: number;
  minimumOffTime: number;
  level1Temperature: number;
  level2Temperature: number;
  hysteresis: number;
}
