import * as express from 'express';
import {
  ChangeRequest,
  TemperatureResult,
} from '@temperature-controller/api-interfaces';
import { getTemperature } from './app/orangepi/temperature';
import { json } from 'body-parser';
import { changeBig, changeSmall } from './app/orangepi/relay';

const app = express();

app.use(express.static('./assets'));
app.use(json());
app.get('/api/temperature', async (req, res) => {
  try {
    const result: TemperatureResult = {
      temperature: await getTemperature(),
    };
    res.send(result);
  } catch (error) {
    res.status(500).send((error as Error).message);
  }
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

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
