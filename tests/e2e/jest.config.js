module.exports = {
  verbose: true,
  preset: 'jest-puppeteer',
  globals: {
    DEVMODE: process.env.NODE_ENV === 'development',
    PAGE_TIMEOUT: 60000
  }
}