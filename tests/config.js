const DEFAULT_TIMEOUT = 60000;

module.exports = {
  serverURL: process.env.ION_TEST_URL?
    (/^http/.test(process.env.ION_TEST_URL)?
      process.env.ION_TEST_URL
      : `http://${process.env.ION_TEST_URL}`)
    : 'http://localhost:8888',

  adminUsername: process.env.ION_TEST_USER || 'demo@local',
  adminPassword: process.env.ION_TEST_PASSWORD || 'ion-demo',

  extSystemUsername: process.env.ION_TEST_EXT_SYSTEM || 'ext@system',
  extSystemSecret: process.env.ION_TEST_EXT_SECRET || 'ion-demo',

  anyUsername: process.env.ION_TEST_ANYUSER || 'user@local',
  anyPassword: process.env.ION_TEST_ANYPASSWORD || 'ion-demo',

  genwsUsername: process.env.ION_TEST_GENWSUSER || 'operator@local',
  genwsPassword: process.env.ION_TEST_GENWSPASSWORD || 'ion-demo',

  browserOptions: {
    headless: (process.env.NODE_ENV? (process.env.NODE_ENV !== 'development') : true),
    width: 1280, height: 1024,
    deviceScaleFactor: 1,
    args: ['--no-sandbox',
      '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-accelerated-2d-canvas', '--disable-gpu',
      '--ignore-certificate-errors', '--window-size=1280,1024', "--proxy-server='direct://'", '--proxy-bypass-list=*'],
    isMobile: false, hasTouch: false, timeout: 0
  },
  DEFAULT_TIMEOUT,
  USER_AGENT: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
  timeoutOptions: {timeout: DEFAULT_TIMEOUT},
  waitUntilOption: {waitUntil: ['load', 'networkidle0']},
  navigationOptions: {timeout: DEFAULT_TIMEOUT, waitUntil: ['load', 'networkidle0']},
  elementVisibleOptions: {timeout: DEFAULT_TIMEOUT, visible: true},
};
