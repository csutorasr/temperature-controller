# TemperatureController

This project was generated using [Nx](https://nx.dev).

This should run on an OrangePI Zero controlling heating with 2 relays.

## Features

- Real-time temperature data.
- Turn on heating at 2 levels.
- Hysteresis.
- Settings with reload after boot.

## Deployment

1. Run `build.sh`.
1. Copy `dist/api` to device.
1. Install `sqlite3`.
1. Run `main.js` with node.
