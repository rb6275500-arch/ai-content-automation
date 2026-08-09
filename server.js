const express = require('express');
const cron = require('node-cron');

const app = express();
app.use(express.json());

// Main Homepage Route (Isse 'Cannot GET /' hategi)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AI Auto Publisher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; background: #121212; color: white; text-align: center; padding: 20px; }
          .card { background: #1e1e1e; padding: 20px; border-radius: 12px; margin-top: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.5); }
          .status { color: #00ff7f; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>🚀 AI Content Auto-Publisher Engine</h2>
        <div class="card">
          <p>Status: <span class="status">LIVE & RUNNING 24/7</span></p>
          <p>YouTube Schedule: 19:00 (7 PM)</p>
          <p>Facebook Schedule: 20:00 (8 PM)</p>
          <p>Instagram Schedule: 21:00 (9 PM)</p>
        </div>
      </body>
    </html>
  `);
});

// Master Automation Cron Job (Har minute time check karega)
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentTime = `${String(istTime.getHours()).padStart(2, '0')}:${String(istTime.getMinutes()).padStart(2, '0')}`;

  console.log(`[Cloud Check ${currentTime}] Server Active...`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
