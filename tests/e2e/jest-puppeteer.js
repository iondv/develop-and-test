'use strict'

const isHeadless = process.env.NODE_ENV === 'development'
const dataDir = process.env.CACHE === 'development' ? require('path').join(__dirname, '.chromium_storage') : null

module.exports = {
  launch: {
    slowMo: process.env.SLOW_MO ? Number(process.env.SLOW_MO) : null,
    devtools: false,
    dumpio: false,
    headless: isHeadless,
    userDataDir: dataDir,
    defaultViewport: isHeadless ? {
      width: 1920,
      height: 1080,
    } : {
      width: 1280, // Minimal width for some tests
      height: 1024,
    },
    deviceScaleFactor: 1,
    args: ['--window-size=1280,1024'],
  },
  browser: 'chromium',
  browserContext: 'default',
}
