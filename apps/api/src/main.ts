import * as express from 'express';
import { json } from 'body-parser';
import { createServer } from 'http';
import { setupRest } from './app/rest';
import { setupSocketIO } from './app/socket.io';
import { startBackgroundJob } from './app/background-job';
import { setupTemperatureCache } from './app/temperature-cache';

const app = express();

app.use(express.static('./assets'));
app.use(json());
setupRest(app);

const port = process.env.port || 3333;
const server = createServer(app);
setupSocketIO(server);
server.listen(port, () => {
  console.log('Listening at http://localhost:' + port + '/');
});
server.on('error', console.error);
startBackgroundJob();
setupTemperatureCache();
