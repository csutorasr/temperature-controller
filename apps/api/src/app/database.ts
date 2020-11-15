import { Database } from 'sqlite3';
import { environment } from '../environments/environment';

const file = environment.production ? 'sqlite.db' : ':memory:';
export const database = new Database(file, (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Connected to the ${file} SQlite database.`);
});
