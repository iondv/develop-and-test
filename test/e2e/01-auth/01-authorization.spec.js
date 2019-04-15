/*
 Тест авторизации и регистрации нового пользователя модуля
 */

const cryptoRandom = require('crypto').randomBytes;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_OK = 200;
const { // Параметры ожидания элементов и страниц
  waitElementLoad,
  slowPageLoad,
  waitPageLoad,
  auth
} = require('../test-param');
auth.password = process.env.ionpassword ? process.env.ionpassword : auth.password;
console.log(auth);

const OPT_ELEMENT_WAIT_VISIBLE = { // Параметры для ожидания видимости элемента
  visible: true,
  timeout: waitElementLoad
};
const OPT_PAGE_WAIT_LOAD = { // Параметры для ожидания загрузки страницы
  timeout: waitPageLoad,
  waitUntil: 'domcontentloaded'
};

let startPage; // Стартовая страница

describe('01 Проверка авторизации', function() {
  describe('Шаг 1. Проверка наличия элементов формы авторизации', function() {
    it('Открываем произвольный адрес, ожидаем код 401 неавторизованный запрос', async function() {
      this.timeout(waitPageLoad);
      this.slow(slowPageLoad); // Так как грузим страницу, время нормального ожидания увеличиваем секунда
      startPage = `${serverURL}/${cryptoRandom(20).toString('hex')}`;
      const response = await page.goto(startPage, OPT_PAGE_WAIT_LOAD);
      assert.equal(response.status(), HTTP_STATUS_UNAUTHORIZED);
    });
    it('Проверяем адрес и ожидаем auth в пути', async function() {
      assert.equal(await page.url(), `${serverURL}/auth`);
    });
    it('Проверяем заголовок платформы при входе', async function() {
      assert.equal(await page.title(), 'Платформа ION: Вход');
    });
    it('Проверка действия в форме action=auth', async function() {
      this.timeout(waitElementLoad);
      /* Альтернатива с ожиданием. Можно удалить, если тест проходит стабильно
      const formPromise = await page.waitForSelector('form', OPT_ELEMENT_WAIT_VISIBLE);
      assert.notEqual(formPromise, null, 'Отсутствует поле форма авторизации');
      const formActionValue = await page.evaluate(form => form.getAttribute('action'), formPromise); */

      const formActionValue = await page.$eval('form', form => form.getAttribute('action'));
      assert.equal(formActionValue, 'auth');
    });
    it('Проверка наличия заголовка формы и текста о "Вход в систему"', async function() {
      this.timeout(waitElementLoad);
      const headerPromise = await page.waitForSelector('header', OPT_ELEMENT_WAIT_VISIBLE);
      assert.notEqual(headerPromise, null, 'Отсутствует поле заголовка авторизации');
      const formHeaderText = await page.$eval('header', formHeader => formHeader.innerText.trim());
      assert.equal(formHeaderText, 'Вход в систему');
    });
    it('Проверка полей авторизации логин, пароль и кол-ва полей 2', async function() {
      assert.notEqual(await page.$('#username'), null, 'Отсутствует поле "логин"');
      assert.notEqual(await page.$('#password'), null, 'Отсутствует поле "пароль"');
      assert.equal(await page.$$eval('.input', inputs => inputs.length), 2);
    });
    it('Проверка кнопоки авторизации и текста "Войти"', async function() {
      const authButtonPromise = await page.$('#authbutton');
      assert.notEqual(authButtonPromise, null, 'Кнопка отправки данных отсутствует');
      const authButtonText = await page.evaluate(authButton => authButton.innerText.trim(), authButtonPromise);
      assert.equal(authButtonText, 'Войти');
    });
  });
  describe('Шаг 2. Проверка авторизации', function() {
    let response;
    it('Авторизуемя под случайным логином без пароля', async function() {
      this.timeout(waitElementLoad + waitPageLoad);
      this.slow(slowPageLoad);
      await page.type('#username', cryptoRandom(8).toString('hex'));
      await page.type('#password', '');
      const navigationPromise = page.waitForNavigation(OPT_PAGE_WAIT_LOAD);
      const authBtnPromise = await page.waitForSelector('#authbutton', OPT_ELEMENT_WAIT_VISIBLE);
      assert.notEqual(authBtnPromise, null, 'Кнопка авторизации отсутствует');
      await authBtnPromise.click();
      response = await navigationPromise; // Ожидаем перезагрузки страницы
    });
    it('Ожидаем код 401 на непрпвильную автоирзацию', function() {
      assert.equal(response.status(), HTTP_STATUS_UNAUTHORIZED);
    });
    it('Ищем сообщение об ошибке входа без пароля и проверяем по шаблону', async function() {
      const errMsgPromise = await page.waitForSelector('#error > p', OPT_ELEMENT_WAIT_VISIBLE);
      assert.notEqual(errMsgPromise, null, 'Сообщение об ошибке отсутствует');
      const errMsgText = await page.evaluate(errMessage => errMessage.innerText.trim(), errMsgPromise);
      assert.equal(errMsgText, 'Не удалось выполнить вход.');
    });
    it('Авторизуемя под случайным логином и случайным паролем', async function() {
      this.timeout(waitPageLoad);
      this.slow(slowPageLoad);
      await page.type('#username', cryptoRandom(8).toString('hex'));
      await page.type('#password', cryptoRandom(10).toString('hex'));
      const navigationPromise = page.waitForNavigation(OPT_PAGE_WAIT_LOAD);
      const authBtnPromise = await page.$('#authbutton');
      await authBtnPromise.click();
      response = await navigationPromise; // Ожидаем перезагрузки страницы
    });
    it('Ожидаем код 401 на непрпвильную автоирзацию', function() {
      assert.equal(response.status(), HTTP_STATUS_UNAUTHORIZED);
    });
    it('Ищем сообщение об ошибке входа под неправильными учётными данынми и проверяем по шаблону', async function() {
      const errMsgPromise = await page.waitForSelector('#error > p', OPT_ELEMENT_WAIT_VISIBLE);
      const errMsgText = await page.evaluate(errMessage => errMessage.innerText.trim(), errMsgPromise);
      assert.equal(errMsgText, 'Не удалось выполнить вход.'); // 2del Old Msg  'Не удалось выполнить вход.'
    });
    it(`Авторизация под заданной учетной записью ${auth.username}`, async function() {
      this.timeout(waitPageLoad);
      this.slow(slowPageLoad);
      await page.type('#username', auth.username);
      await page.type('#password', auth.password);
      const navigationPromise = page.waitForNavigation(OPT_PAGE_WAIT_LOAD);
      const authBtnPromise = await page.$('#authbutton');
      await authBtnPromise.click();
      response = await navigationPromise; // Ожидаем перезагрузки страницы
    });
    it('Ожидаем адрес первоначально запрашиваемой произвольной страницы и код отсутствия страницы 404', function() {
      assert.equal(response.status(), HTTP_STATUS_NOT_FOUND);
    });
    it('Проверяем отсутствие ошибки авторизации и переход на произвольную страницу', async function() {
      const errMsgPromise = await page.$('#error > p');
      assert.equal(errMsgPromise, null, 'Есть сообщение об ошибке ');
      assert.equal(await page.url(), startPage);
    });
  });
  describe('Шаг 3. Проверяем доступность страницы по умолчанию', function() {
    it('Открываем корень сайта, ожидаем переадресацию с кодом 200', async function() {
      this.timeout(waitPageLoad);
      this.slow(slowPageLoad); // Так как грузим страницу, время нормального ожидания увеличиваем
      const response = await page.goto(`${serverURL}/`, OPT_PAGE_WAIT_LOAD);
      assert.equal(response.status(), HTTP_STATUS_OK);
    });
    it('Проверяем адрес после переадресации и ожидаем registry в пути', async function() {
      assert.equal(await page.url(), `${serverURL}/registry/develop-and-test@class_string`);
      // 4debug await page.screenshot({path: 'example1.png'});
    });
  });
});
