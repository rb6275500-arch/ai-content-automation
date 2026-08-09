const express = require('express');
const cron = require('node-cron');
const axios = require('axios');

const app = express();
app.use(express.json());

// Main Automation Config Store (Aapke app se update hoga)
let userSettings = {
  niche: {
    youtube: "Bhagavad Gita & Life Wisdom",
    facebook: "Daily Motivation Hindi",
    instagram: "Krishnaradhe Quotes"
  },
  schedules: {
    youtube: "19:00",  // 7:00 PM
    facebook: "20:00", // 8:00 PM
    instagram: "21:00" // 9:00 PM
  },
  automationOn: true
};

// Mobile Control Panel API (App se settings change karne ke liye)
app.get('/api/settings', (req, res) => res.json(userSettings));

app.post('/api/settings', (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ status: "Success", message: "Settings Updated Successfully!", settings: userSettings });
});

// Master Auto Publisher Engine (Har minute check karega)
cron.schedule('* * * * *', async () => {
  if (!userSettings.automationOn) return;

  const now = new Date();
  // IST Time Zone Correction
  const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const currentTime = `${String(istTime.getHours()).padStart(2, '0')}:${String(istTime.getMinutes()).padStart(2, '0')}`;

  console.log(`[Cloud Check at ${currentTime}] System Running...`);

  // YouTube Schedule Trigger
  if (userSettings.schedules.youtube === currentTime) {
    console.log("🚀 YouTube Video Generation & Auto-Publish Triggered!");
    // Cloud Video Engine Call Hoga
  }

  // Facebook Schedule Trigger
  if (userSettings.schedules.facebook === currentTime) {
    console.log("🚀 Facebook Video Generation & Auto-Publish Triggered!");
  }

  // Instagram Schedule Trigger
  if (userSettings.schedules.instagram === currentTime) {
    console.log("🚀 Instagram Video Generation & Auto-Publish Triggered!");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on port ${PORT}`));

