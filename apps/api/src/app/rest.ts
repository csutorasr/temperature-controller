import { Express } from 'express';
import {
  TemperatureResult,
  ChangeRequest,
  ConfigurationResult,
} from '@temperature-controller/api-interfaces';
import { changeSmall, changeBig } from './orangepi/relay';
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
      minimumOffTime: body.minimumOffTime,
      minimumOnTime: body.minimumOnTime,
    });
    res.sendStatus(200);
  });
  app.post('/api/relay/off', async (_, res) => {
    try {
      await changeSmall(false);
      await changeBig(false);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
  app.post('/api/relay/level1', async (_, res) => {
    try {
      await changeSmall(true);
      await changeBig(false);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
  app.post('/api/relay/level2', async (_, res) => {
    try {
      await changeSmall(true);
      await changeBig(true);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
}
