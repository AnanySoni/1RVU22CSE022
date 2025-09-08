const express = require('express');
const shortUrlRoutes = require('./routes/shorturl');
const logger = require('./middleware/logger');

const app = express();
app.use(express.json());
app.use(logger);

app.use('/shorturls', shortUrlRoutes);

// Redirect endpoint
app.get('/:shortcode', shortUrlRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Shortener service running on port ${PORT}`);
});
