# Solar Finance Australia Calculator

## Included files
- `server.js`: Express server and hidden finance calculation settings.
- `package.json`: Node.js configuration for Render.
- `public/index.html`: Customer calculator with automatic recalculation and print button.
- `public/solar-finance-logo.jpeg`: Supplied branding.
- `admin.html`: Standalone offline editor that generates a replacement `server.js`.

## Deploy on Render
1. Upload the project contents to a GitHub repository.
2. Create a Render Web Service from the repository.
3. Use `npm install` as the build command and `npm start` as the start command.
4. After changing hidden data in `admin.html`, upload the generated `server.js` to the repository and redeploy.

The customer page never receives rates, broker multipliers, fees, or tier thresholds. Calculations are performed by the server API.
