import { Express } from 'express';
import {
  TemperatureResult,
  ChangeRequest,
} from '@temperature-controller/api-interfaces';
import { changeSmall, changeBig } from './orangepi/relay';
import { temperatureCache } from './temperature-cache';

export function setupRest(app: Express) {
  app.get('/api/temperature', (req, res) => {
    const result: TemperatureResult = {
      temperature: temperatureCache,
    };
    res.send(result);
  });
  app.post('/api/relay/small', async (req, res) => {
    const data: ChangeRequest = req.body;
    try {
      await changeSmall(data.on);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
  app.post('/api/relay/big', async (req, res) => {
    const data: ChangeRequest = req.body;
    try {
      await changeBig(data.on);
      res.sendStatus(200);
    } catch (error) {
      res.status(500).send((error as Error).message);
    }
  });
}
