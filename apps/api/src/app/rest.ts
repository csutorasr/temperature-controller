import { Express } from 'express';
import {
  TemperatureResult,
  ChangeRequest,
  ConfigurationResult,
} from '@temperature-controller/api-interfaces';
import { turnOff, turnOnLevel } from './orangepi/relay';
import { temperatureCache } from './temperature-cache';
import { setSettings, settings } from './settings';

export function setupRest(app: Express) {
  app.get('/api/temperature', (req, res) => {
    const result: TemperatureResult = {
      temperature: temperatureCache,
    };
    res.send(result);
  });
  app.get('/api/settings', (req, res) => {
    const result: ConfigurationResult = settings;
    res.send(result);
  });
  app.post('/api/settings', async (req, res) => {
    const body = req.body;
    await setSettings({
      hysteresis: body.hysteresis,
      level1Temperature: body.level1Temperature,
      level2Temperature: body.level2Temperature,
      level3Temperature: body.level3Temperature,
      minimumOffTime: body.minimumOffTime,
      minimumOnTime: body.minimumOnTime,
    });
    res.sendStatus(200);
  });
  app.post('/api/relay/off', async (_, res) => {
    try {
      await turnOff();
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
  app.post('/api/relay/level:level', async (req, res) => {
    try {
      const level = +req.params.level - 1;
      if (level === 0 || level === 1 || level === 2) {
        await turnOnLevel(level);
      }
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
}
