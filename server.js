const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Current Active Schedules
let schedules = {
  youtube: "10:45",
  facebook: "10:45",
  instagram: "10:45"
};

// Master Dashboard UI Route
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Auto Publisher - Master Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; padding: 20px; }
    .container { max-width: 700px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 20px; }
    header h1 { font-size: 1.6rem; color: #38bdf8; margin-bottom: 6px; }
    .status-badge { background: #22c55e; color: #000; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; display: inline-block; }
    .card { background: #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 18px; border: 1px solid #334155; }
    .card h2 { font-size: 1.1rem; margin-bottom: 12px; color: #f1f5f9; border-bottom: 1px solid #334155; padding-bottom: 6px; }
    .platform-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: #0f172a; padding: 10px 12px; border-radius: 8px; }
    .platform-info { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.95rem; }
    .btn-connect { background: #2563eb; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
    .btn-connect:hover { background: #1d4ed8; }
    .info-list { list-style: none; line-height: 1.8; font-size: 0.9rem; color: #cbd5e1; }
    .info-list strong { color: #f8fafc; }
    .btn-action { background: #10b981; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 8px; font-size: 0.9rem; }
    .btn-action:hover { background: #059669; }
    .btn-trigger { background: #e11d48; margin-top: 10px; }
    .btn-trigger:hover { background: #be123c; }
    .links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
    .app-link { background: #0f172a; color: #38bdf8; text-decoration: none; padding: 10px; border-radius: 8px; text-align: center; font-size: 0.85rem; font-weight: 600; border: 1px solid #334155; }
    .app-link:hover { background: #334155; color: #fff; }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <h1>🚀 AI Auto Publisher Dashboard</h1>
      <span class="status-badge">SYSTEM ONLINE</span>
    </header>

    <div class="card">
      <h2>📌 Active Schedules (IST Time)</h2>
      <ul class="info-list">
        <li><strong>YouTube Shorts:</strong> ${schedules.youtube} IST</li>
        <li><strong>Facebook Reels:</strong> ${schedules.facebook} IST</li>
        <li><strong>Instagram Reels:</strong> ${schedules.instagram} IST</li>
      </ul>

      <form action="/trigger-now" method="POST">
        <button type="submit" class="btn-action btn-trigger">⚡ Force Generate & Post Video Now</button>
      </form>
    </div>

    <div class="card">
      <h2>🎯 Selected Niche</h2>
      <ul class="info-list">
        <li><strong>YouTube:</strong> Bhagavad Gita & Spirituality</li>
        <li><strong>Facebook:</strong> Daily Motivation Hindi</li>
        <li><strong>Instagram:</strong> Krishnaradhe Quotes</li>
      </ul>
    </div>

    <div class="card">
      <h2>🔗 Account Connections</h2>
      
      <div class="platform-row">
        <div class="platform-info"><span>▶️ YouTube</span></div>
        <a href="/auth/youtube" class="btn-connect">Connect YouTube</a>
      </div>

      <div class="platform-row">
        <div class="platform-info"><span>📸 Instagram</span></div>
        <a href="/auth/facebook" class="btn-connect">Connect Instagram</a>
      </div>

      <div class="platform-row">
        <div class="platform-info"><span>📘 Facebook</span></div>
        <a href="/auth/facebook" class="btn-connect">Connect Facebook</a>
      </div>
    </div>

    <div class="card">
      <h2>🌐 Quick App Links</h2>
      <div class="links-grid">
        <a href="https://dashboard.render.com" target="_blank" class="app-link">Render Server</a>
        <a href="https://github.com" target="_blank" class="app-link">GitHub Code</a>
        <a href="https://cron-job.org" target="_blank" class="app-link">Cron-Job</a>
        <a href="https://studio.youtube.com" target="_blank" class="app-link">YouTube Studio</a>
        <a href="https://business.facebook.com" target="_blank" class="app-link">Meta Business</a>
      </div>
    </div>

  </div>

</body>
</html>
  `);
});

// Force Trigger Route
app.post('/trigger-now', (req, res) => {
  console.log('⚡ Manual Video Creation Triggered!');
  res.send('<h2>⚡ Video generation process started! Check Render logs for progress.</h2><a href="/">Back to Dashboard</a>');
});

// Real YouTube OAuth Route (FIXED REDIRECT URL & ENCODING)
app.get('/auth/youtube', (req, res) => {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'https://ai-content-automation-ti7.onrender.com/auth/youtube/callback';

  if (!clientId) {
    return res.status(500).send('<h3>Error: YOUTUBE_CLIENT_ID missing in Render Environment Variables!</h3>');
  }

  const scope = 'https://www.googleapis.com/auth/youtube.upload';
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline&prompt=consent`;

  res.redirect(googleAuthUrl);
});

// YouTube OAuth Callback Route
app.get('/auth/youtube/callback', (req, res) => {
  const code = req.query.code;
  if (code) {
    res.send('<h2>✅ YouTube Authorization Code Received! Save this token in your backend.</h2><br><a href="/">Back to Dashboard</a>');
  } else {
    res.send('<h2>❌ Authorization failed or cancelled.</h2><br><a href="/">Back to Dashboard</a>');
  }
});

// Facebook OAuth Route
app.get('/auth/facebook', (req, res) => {
  res.send('Connecting to Meta/Facebook OAuth...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Current Active Schedules
let schedules = {
  youtube: "10:45",
  facebook: "10:45",
  instagram: "10:45"
};

// Master Dashboard UI Route
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI Auto Publisher - Master Dashboard</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
    body { background-color: #0f172a; color: #f8fafc; padding: 20px; }
    .container { max-width: 700px; margin: 0 auto; }
    
    header { text-align: center; margin-bottom: 20px; }
    header h1 { font-size: 1.6rem; color: #38bdf8; margin-bottom: 6px; }
    .status-badge { background: #22c55e; color: #000; font-weight: bold; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; display: inline-block; }

    .card { background: #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 18px; border: 1px solid #334155; }
    .card h2 { font-size: 1.1rem; margin-bottom: 12px; color: #f1f5f9; border-bottom: 1px solid #334155; padding-bottom: 6px; }

    .platform-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; background: #0f172a; padding: 10px 12px; border-radius: 8px; }
    .platform-info { display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.95rem; }
    .btn-connect { background: #2563eb; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; font-weight: bold; }
    .btn-connect:hover { background: #1d4ed8; }

    .info-list { list-style: none; line-height: 1.8; font-size: 0.9rem; color: #cbd5e1; }
    .info-list strong { color: #f8fafc; }

    .btn-action { background: #10b981; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; margin-top: 8px; font-size: 0.9rem; }
    .btn-action:hover { background: #059669; }
    .btn-trigger { background: #e11d48; margin-top: 10px; }
    .btn-trigger:hover { background: #be123c; }

    .links-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
    .app-link { background: #0f172a; color: #38bdf8; text-decoration: none; padding: 10px; border-radius: 8px; text-align: center; font-size: 0.85rem; font-weight: 600; border: 1px solid #334155; }
    .app-link:hover { background: #334155; color: #fff; }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <h1>🚀 AI Auto Publisher Dashboard</h1>
      <span class="status-badge">SYSTEM ONLINE</span>
    </header>

    <div class="card">
      <h2>📌 Active Schedules (IST Time)</h2>
      <ul class="info-list">
        <li><strong>YouTube Shorts:</strong> ${schedules.youtube} IST</li>
        <li><strong>Facebook Reels:</strong> ${schedules.facebook} IST</li>
        <li><strong>Instagram Reels:</strong> ${schedules.instagram} IST</li>
      </ul>

      <form action="/trigger-now" method="POST">
        <button type="submit" class="btn-action btn-trigger">⚡ Force Generate & Post Video Now</button>
      </form>
    </div>

    <div class="card">
      <h2>🎯 Selected Niche</h2>
      <ul class="info-list">
        <li><strong>YouTube:</strong> Bhagavad Gita & Spirituality</li>
        <li><strong>Facebook:</strong> Daily Motivation Hindi</li>
        <li><strong>Instagram:</strong> Krishnaradhe Quotes</li>
      </ul>
    </div>

    <div class="card">
      <h2>🔗 Account Connections</h2>
      
      <div class="platform-row">
        <div class="platform-info"><span>▶️ YouTube</span></div>
        <a href="/auth/youtube" class="btn-connect">Connect YouTube</a>
      </div>

      <div class="platform-row">
        <div class="platform-info"><span>📸 Instagram</span></div>
        <a href="/auth/facebook" class="btn-connect">Connect Instagram</a>
      </div>

      <div class="platform-row">
        <div class="platform-info"><span>📘 Facebook</span></div>
        <a href="/auth/facebook" class="btn-connect">Connect Facebook</a>
      </div>
    </div>

    <div class="card">
      <h2>🌐 Quick App Links</h2>
      <div class="links-grid">
        <a href="https://dashboard.render.com" target="_blank" class="app-link">Render Server</a>
        <a href="https://github.com" target="_blank" class="app-link">GitHub Code</a>
        <a href="https://cron-job.org" target="_blank" class="app-link">Cron-Job</a>
        <a href="https://studio.youtube.com" target="_blank" class="app-link">YouTube Studio</a>
        <a href="https://business.facebook.com" target="_blank" class="app-link">Meta Business</a>
      </div>
    </div>

  </div>

</body>
</html>
  `);
});

// OAuth Callback Route (Isse Not Found Solved Ho Jayega)
app.get(['/oauth2callback', '/auth/youtube/callback'], (req, res) => {
  const code = req.query.code;
  if (code) {
    console.log('Authorization Code received:', code);
    res.send(`
      <div style="font-family:sans-serif; text-align:center; padding: 40px; background:#0f172a; color:#fff; height:100vh;">
        <h1 style="color:#22c55e;">✅ YouTube Account Successfully Connected!</h1>
        <p>Authorization Code: <b>${code}</b></p>
        <p style="margin-top:20px;"><a href="/" style="color:#38bdf8;">Return to Dashboard</a></p>
      </div>
    `);
  } else {
    res.send('<h2>Authorization Code missing!</h2><a href="/">Back to Dashboard</a>');
  }
});

// Force Trigger Route
app.post('/trigger-now', (req, res) => {
  console.log('⚡ Manual Video Creation Triggered!');
  res.send('<h2>⚡ Video generation process started! Check Render logs for progress.</h2><a href="/">Back to Dashboard</a>');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
