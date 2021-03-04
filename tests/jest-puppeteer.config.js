const config = require('./config.js');

module.exports = {
  launch: config.browserOptions,
  browser: 'chromium',
  browserContext: 'default',
}
