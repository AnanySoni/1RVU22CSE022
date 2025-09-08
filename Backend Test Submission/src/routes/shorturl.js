const express = require('express');
const router = express.Router();
const { createShortUrl, getUrlData, recordClick } = require('../services/urlService');

// Create Short URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
}

router.post('/', async (req, res) => {
  console.log('DEBUG req.body:', req.body); // Debug log
  const { url, validity, shortcode } = req.body;
  if (!url || typeof url !== 'string' || !isValidUrl(url)) {
    await req.log('error', 'route', 'Invalid URL input');
    return res.status(400).json({ error: 'Invalid URL' });
  }
  try {
    const { code, expiry } = createShortUrl({ url, validity, shortcode });
    await req.log('info', 'route', `Short URL created: ${code}`);
    res.status(201).json({ shortLink: `${req.protocol}://${req.get('host')}/${code}`, expiry: expiry.toISOString() });
  } catch (err) {
    await req.log('error', 'route', err.message);
    res.status(400).json({ error: err.message });
  }
});

// Redirect Short URL
router.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const data = getUrlData(shortcode);
  if (!data) {
    await req.log('warn', 'route', `Shortcode not found: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  if (new Date() > data.expiry) {
    await req.log('warn', 'route', `Shortcode expired: ${shortcode}`);
    return res.status(410).json({ error: 'Shortcode expired' });
  }
  recordClick(shortcode, req);
  await req.log('info', 'route', `Redirected: ${shortcode}`);
  res.redirect(data.url);
});

// Retrieve Short URL Statistics
router.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const data = getUrlData(shortcode);
  if (!data) {
    await req.log('warn', 'route', `Stats not found: ${shortcode}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }
  res.json({
    totalClicks: data.clicks.length,
    url: data.url,
    createdAt: data.createdAt,
    expiry: data.expiry,
    clicks: data.clicks.map(c => ({
      timestamp: c.timestamp,
      referrer: c.referrer,
      ip: c.ip
      // geo: c.geo
    }))
  });
});

module.exports = router;
