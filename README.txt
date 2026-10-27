SOLAR FINANCE CALCULATOR

Online files
- server.js
- package.json
- public/index.html
- public/logo.jpeg

Offline admin file
- admin.html (do not upload this file to the public website)

Local test
1. Install Node.js 18 or newer.
2. Open a terminal in this folder.
3. Run: npm install
4. Run: npm start
5. Visit: http://localhost:3000

Render deployment
- Build command: npm install
- Start command: npm start

Updating hidden data
1. Open admin.html directly in a browser while offline.
2. Update the thresholds, rates, multiplier and fee.
3. Click Generate server.js.
4. Replace the online server.js with the downloaded file.
5. Commit/push the change or upload it to your hosting provider, then redeploy.

Important
The public page sends only the equipment price to the server. Rates, tiers, document fee and multiplier stay in server.js and are not exposed in the public HTML or calculation response.
