const cryptoRandom = require('crypto').randomBytes;
const HTTP_STATUS_UNAUTHORIZED = 401;
const HTTP_STATUS_NOT_FOUND = 404;
const HTTP_STATUS_OK = 200;
const config = require('../../../config.js');
const selectors = require('../../resource/auth/selectors.json');
const util = require('../../resource/auth/util.js');

describe('# checking authorization', function() {
  const url = `${config.serverURL}/${cryptoRandom(20).toString('hex')}`;
  describe('# checking authorization form elements', function() {
    let response;
    beforeAll(async function() {
      response = await page.goto(url, config.navigationOptions);
    });
    it('Trying to access random service, expecting a response of 401', async function() {
      expect(response.status()).toEqual(HTTP_STATUS_UNAUTHORIZED);
    });
    it('Expecting a redirect to auth page', async function() {
      expect(page.url()).toEqual(`${config.serverURL}/auth`);
    });
    it('Checking auth page title', async function() {
      expect(['Platform ION: Login', 'Платформа ION: Вход']).toContainEqual(await page.title());
    });
    it('Checking if the form action is auth', async function() {
      const formActionValue = await page.$eval(selectors.form, form => form.getAttribute('action'));
      expect(formActionValue).toEqual('auth');
    });
    it('Checking visibility and text of the form header', async function() {
      // this.timeout(waitElementLoad);
      const formHeaderText = await page.$eval(selectors.header, formHeader => formHeader.innerText.trim());
      expect(['Вход в систему', 'Logging in']).toContainEqual(formHeaderText);
    });
    it('Checking input fields', async function() {
      await page.waitForSelector(selectors.login, config.elementVisibleOptions);
      expect(await page.$(selectors.login)).toBeTruthy();
      await page.waitForSelector(selectors.password, config.elementVisibleOptions);
      expect(await page.$(selectors.password)).toBeTruthy();
      const inputEls = await page.$$eval(selectors.inputField, inputs =>
        inputs.filter(input => {
            const boundingBox = input.getBoundingClientRect();
            return boundingBox && (boundingBox.width > 0) && (boundingBox.height > 0);
          }
        )
      );
      expect(inputEls).toHaveLength(2);
    });
    it('Checking the submit button', async function() {
      const authButtonPromise = await page.$('#authbutton');
      await page.waitForSelector(selectors.submit, config.elementVisibleOptions);
      expect(await page.$(selectors.submit)).toBeTruthy();
      const authButtonText = await page.$eval(selectors.submit, authButton => authButton.innerText.trim());
      expect(['Войти', 'Sign in', 'Submit', 'Log in']).toContainEqual(authButtonText); // the button text is not translated to english yet
    });
  });
  describe('# checking authorization functionality', function() {
    describe('# Trying to authorize without a password', function() {
      let response;
      beforeAll(async function () {
        // this.timeout(waitElementLoad + waitPageLoad);
        // this.slow(slowPageLoad);
        response = await util.logIn(page, {
          login: cryptoRandom(8).toString('hex'),
          password: null
        });
      });
      it('Expecting 401 in response to invalid authorization', function () {
        expect(response.status()).toEqual(HTTP_STATUS_UNAUTHORIZED);
      });
      it('Checking error message', async function () {
        const errorEl = await page.waitForSelector(selectors.errorMessage, config.elementVisibleOptions);
        expect(errorEl).toBeTruthy();
        const errMsgText = await errorEl.evaluate(errorEl => errorEl.innerText.trim());
        expect(['Не удалось выполнить вход.', 'Failed to sign in.']).toContainEqual(errMsgText);
      });
    });
    describe('# Trying to authorize with random login and password', function() {
      let response;
      beforeAll(async function () {
        // this.timeout(waitElementLoad + waitPageLoad);
        // this.slow(slowPageLoad);
        response = await util.logIn(page, {
          login: cryptoRandom(8).toString('hex'),
          password: cryptoRandom(10).toString('hex')
        });
      });
      it('Expecting 401 in response to invalid authorization', function () {
        expect(response.status()).toEqual(HTTP_STATUS_UNAUTHORIZED);
      });
      it('Checking error message', async function () {
        const errorEl = await page.waitForSelector(selectors.errorMessage, config.elementVisibleOptions);
        expect(errorEl).toBeTruthy();
        const errMsgText = await errorEl.evaluate(errorEl => errorEl.innerText.trim());
        expect(['Не удалось выполнить вход.', 'Failed to sign in.']).toContainEqual(errMsgText);
      });
    });
    describe('# Trying to authorize with defined login and password', function() {
      let response;
      beforeAll(async function () {
        response = await util.logIn(page, config.users.admin);
      });
      it('Expecting 404 in response to inexistent url request', function () {
        expect(response.status()).toEqual(HTTP_STATUS_NOT_FOUND);
      });
      it('Checking error message', async function () {
        const errorEl = await page.$(selectors.errorMessage);
        expect(errorEl).toBeNull();
        expect(page.url()).toEqual(url);
      });
    });
  });
  describe('Checking availability of application\'s start page', function() {
    it('Requesting application\'s root, expecting HTTP 200', async function() {
      // this.timeout(waitPageLoad);
      // this.slow(slowPageLoad); // Так как грузим страницу, время нормального ожидания увеличиваем
      const response = await page.goto(`${config.serverURL}/`, config.navigationOptions);
      expect(response.status()).toEqual(HTTP_STATUS_OK);
    });
    it('Checking url after redirection, expecting it to contain registry', async function() {
      expect(page.url()).toMatch(new RegExp(`${config.serverURL}/registry`));
    });
  });
});
