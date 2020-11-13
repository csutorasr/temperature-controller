import { database } from './database';

export interface Setting {
  name: string;
  value: string;
}

export interface Configuration {
  minimumOnTime: number;
  minimumOffTime: number;
  level1Temperature: number;
  level2Temperature: number;
  hysteresis: number;
}

export let settings: Configuration = {
  minimumOnTime: 30,
  minimumOffTime: 30,
  hysteresis: 2,
  level1Temperature: 45,
  level2Temperature: 55,
};

database.serialize(async () => {
  await createTable();
  await loadSettings();
  await saveSettings();
});

async function createTable(): Promise<void> {
  return new Promise((resolve, reject) =>
    database.run(
      'CREATE TABLE IF NOT EXISTS Settings(name text PRIMARY KEY, value text)',
      (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      }
    )
  );
}

async function loadSettings(): Promise<void> {
  return new Promise((resolve, reject) =>
    database.serialize(() => {
      database.all(
        `SELECT name, value FROM Settings`,
        [],
        (err, row: Setting[]) => {
          if (err) {
            console.error(err.message);
            return reject();
          }
          const dbSettings: Partial<Configuration> = row.reduce(
            (acc, curr) => ({ ...acc, [curr.name]: +curr.value }),
            {}
          );
          settings = {
            ...settings,
            ...dbSettings,
          };
          resolve();
        }
      );
    })
  );
}

export async function saveSettings(): Promise<void> {
  return new Promise((resolve) => {
    database.serialize(async () => {
      await Promise.all(
        Object.keys(settings).map(async (key) => {
          await insertRow(key, settings[key]);
        })
      );
      return resolve();
    });
  });
}

async function insertRow(name: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      'INSERT OR REPLACE INTO Settings(name, value) VALUES(?, ?)',
      [name, value],
      (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      }
    );
  });
}
