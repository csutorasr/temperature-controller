import { Database } from 'sqlite3';
import { environment } from '../environments/environment';

export const database = new Database(
  environment.production ? 'sqlite.db' : ':memory:',
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the in-memory SQlite database.');
  }
);
