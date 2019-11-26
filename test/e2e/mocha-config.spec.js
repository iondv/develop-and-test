const puppeteer = require('puppeteer'); // API https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
const assert = require('assert');

const {waitPageLoad} = require('./test-param');

const options = { // См. https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  // headless: false // По умолчанию true - режим без отображения окна
  args: ['--no-sandbox', '--no-default-browser-check'] // https://peter.sh/experiments/chromium-command-line-switches/
};

if (process.env.NODE_ENV === 'development') { // Задаем переменную окружения SET NODE_ENV=development чтобы дебажить
  options.headless = false; // Дебажим с просмотром окна браузера
  //options.slowMo = 100; // Замедлить операции
}


before(async function() { // До запуска тестов
  console.info('Конфигурируем глобальные настройки mocha и проводим инициализацию');
  this.timeout(waitPageLoad);
  global.browser = await puppeteer.launch(options);
  global.page = await browser.newPage();
  global.assert = assert;

  if (process.env.ION_TEST_URL) {
    if (process.env.ION_TEST_URL.indexOf('http://') === -1) {
      process.env.ION_TEST_URL = `http://${process.env.ION_TEST_URL}`;
    }
    global.serverURL = process.env.ION_TEST_URL;
  } else {
    global.serverURL = 'http://localhost:8888';
  }

  console.info(`Адрес сервера для тестирования: ${serverURL}`);
  await page.setViewport({width: 1280, height: 800});
});


after(async function() { // После запуска тестов
  console.info('Очищаем все глобальные настройки mocha и проводим выход из тестов');
  this.timeout(5000);
  await browser.close();
});
