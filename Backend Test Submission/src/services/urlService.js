const { v4: uuidv4 } = require('uuid');

// In-memory store for demo
const urlMap = new Map(); // shortcode -> { url, expiry, createdAt, clicks: [] }

function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function isValidShortcode(code) {
  return /^[a-zA-Z0-9]{4,}$/.test(code);
}

function createShortUrl({ url, validity, shortcode }) {
  // ...existing code...
  const now = new Date();
  const expiry = new Date(now.getTime() + (validity || 30) * 60000);
  let code = shortcode;
  if (code) {
    if (!isValidShortcode(code) || urlMap.has(code)) {
      throw new Error('Invalid or duplicate shortcode');
    }
  } else {
    do {
      code = generateShortcode();
    } while (urlMap.has(code));
  }
  urlMap.set(code, {
    url,
    expiry,
    createdAt: now,
    clicks: []
  });
  return { code, expiry };
}

function getUrlData(code) {
  return urlMap.get(code);
}

function recordClick(code, req) {
  const data = urlMap.get(code);
  if (!data) return;
  data.clicks.push({
    timestamp: new Date(),
    referrer: req.get('referer') || '',
    ip: req.ip || req.connection.remoteAddress || '',
    // geo: (use a geoip library if needed)
  });
}

module.exports = {
  createShortUrl,
  getUrlData,
  recordClick
};
