yarn nx build api --configuration=production
yarn nx build temperature-controller --configuration=production
mv dist/apps/temperature-controller/* dist/apps/api/assets
