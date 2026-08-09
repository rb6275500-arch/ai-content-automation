const express = require('express');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
app.use(express.json());

// User Settings Store
let userSettings = {
  niches: {
    youtube: "Bhagavad Gita & Spirituality",
    facebook: "Daily Motivation Hindi",
    instagram: "Krishnaradhe Quotes"
  },
  schedules: {
    youtube: "19:00",
    facebook: "20:00",
    instagram: "21:00"
  },
  automationOn: true
};

// Dashboard Route (Mobile Friendly)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>AI Auto Publisher</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0f172a; color: white; text-align: center; padding: 20px; }
          .card { background: #1e293b; padding: 20px; border-radius: 16px; margin: 15px auto; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid #334155; }
          .status { color: #38bdf8; font-weight: bold; }
          .badge { background: #22c55e; color: black; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; }
          h2 { color: #f8fafc; }
        </style>
      </head>
      <body>
        <h2>🚀 AI Auto Publisher Dashboard</h2>
        <span class="badge">SYSTEM ONLINE</span>
        <div class="card">
          <h3>📌 Active Schedules</h3>
          <p><b>YouTube Shorts:</b> ${userSettings.schedules.youtube} IST</p>
          <p><b>Facebook Reels:</b> ${userSettings.schedules.facebook} IST</p>
          <p><b>Instagram Reels:</b> ${userSettings.schedules.instagram} IST</p>
        </div>
        <div class="card">
          <h3>🎯 Niche Selected</h3>
          <p><b>YouTube:</b> ${userSettings.niches.youtube}</p>
          <p><b>Facebook:</b> ${userSettings.niches.facebook}</p>
          <p><b>Instagram:</b> ${userSettings.niches.instagram}</p>
        </div>
      </body>
    </html>
  `);
});

// Settings Fetch and Update API for Mobile App
app.get('/api/settings', (req, res) => res.json(userSettings));
app.post('/api/settings', (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ message: "Settings Updated Successfully!", settings: userSettings });
});

// Master Automation Cron Job (Runs every minute)
cron.schedule('* * * * *', async () => {
  if (!userSettings.automationOn) return;

  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentTime = `${String(istTime.getHours()).padStart(2, '0')}:${String(istTime.getMinutes()).padStart(2, '0')}`;

  console.log(`[Check at ${currentTime}] Auto-Publisher is scanning...`);

  // Triggers for specific times
  if (userSettings.schedules.youtube === currentTime) {
    console.log("🎬 Triggering Automatic Video Creation for YouTube...");
  }
  if (userSettings.schedules.facebook === currentTime) {
    console.log("🎬 Triggering Automatic Video Creation for Facebook...");
  }
  if (userSettings.schedules.instagram === currentTime) {
    console.log("🎬 Triggering Automatic Video Creation for Instagram...");
  }
});



const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  'https://ai-content-automation-lti7.onrender.com/oauth2callback'
);

// YouTube Login Route
app.get('/login-youtube', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/youtube.upload']
  });
  res.redirect(url);
});

// Callback Route
app.get('/oauth2callback', async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  console.log('REFRESH TOKEN:', tokens.refresh_token);
  res.send('YouTube Connected Successfully! 🎉');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
