// Тест авторизации и регистрации нового пользователя модуля
/* globals describe, before, it, browser, expect, protractor, element, by */
const crypto = require('crypto');
let serverURL = browser.params.serverURL + browser.params.path.modulePrefix;
const http = require('http');
const you = Object.assign(require('../util/list'),
  require('../util/entity'),
  require('../util/filter'),
  require('../util/frame'),
  require('../util/iterance'));

function getUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      statusCode = res.statusCode;
      console.log('http res ', statusCode);
      if (statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    }).on('error', () => {
      resolve(false);
    });
  });
}

describe(`Проверка авторизации  ${browser.params.serverURL}`, () => {
  before('Проверяем доступность Selenium сервера', async () => {
    await you.iterance(async function() {
      return await getUrl(browser.params.seleniumURL);
    });
  });
  describe('Шаг 1. Проверка наличия элементов формы авторизации', () => {
    before(function () {
      const url = crypto.randomBytes(20).toString('hex');
      this.timeout(browser.params.waitPageLoad * 10);
      browser.get(`${serverURL}/${url}`);
    });
    it('Проверка открытия страницы авторизации, при запросе произвольного адреса', function () {
      browser.wait(EC.urlContains(browser.params.serverURL +
        browser.params.path.authorization),
        browser.params.waitElementLoad * 10,
        'Адрес страницы не соответствует странице авторизации');
      expect(browser.getTitle()).to.eventually.equal(browser.params.title.authorization,
        'Заголовок страницы не соответствует странице авторизации');
    });
    it('Проверка формы', () => {
      expect(element(by.css('form')).isDisplayed()).to.eventually.equal(true,
        'Форма авторизации отсутствует');
      expect(element(by.css('form')).getAttribute('action')).to.eventually.equal(browser.params.serverURL +
        (browser.params.path.authorization), 'Неверное действие формы');
    });
    it('Проверка заголовка', () => {
      expect(element(by.css('header')).isDisplayed()).to.eventually.equal(true,
        'Заголовок формы авторизации отсутствует');
      expect(element(by.css('header')).getText()).to.eventually.equal(browser.params.captions.authFormTitle,
        'Неправильный заголовок формы авторизации');
    });
    it('Проверка полей', () => {
      expect(element(by.id('username')).isDisplayed()).to.eventually.equal(true,
        'Отсутствует поле "логин"');
      element.all(by.id('password')).each((passwordInput) => {
        expect(passwordInput.isDisplayed()).to.eventually.equal(true,
          'Отсутствуте поле "пароль"');
      });
      expect(element.all(by.className('input')).count()).to.eventually.equal(2,
        'Неверное количество полей ввода пароля');
    });
    it('Проверка кнопок', function () {
      expect(element(by.id('authbutton')).isDisplayed()).to
        .eventually.equal(true, 'Кнопка отправки данных не видна');
      expect(element(by.id('authbutton')).getText()).to.eventually.equal(browser.params.captions.authButton,
        'Подпись кнопки отправки данных неверна');
    });
  });
  describe('Шаг 2. Проверка авторизации', function () {
    it('Проверка ошибки при попытке авторизации под случайным логином без пароля', async function () {
      const userName = crypto.randomBytes(8).toString('hex');
      let userPassword = '';
      await you.enterTextInField(userName, 'username');
      await you.enterTextInField(userPassword, 'password');
      await browser.wait(EC.visibilityOf(element(by.id('authbutton'))), browser.params.waitElementLoad,
        'Кнопка авторизации не отобразилась');
      await element(by.id('authbutton')).click();
      await browser.wait(EC.visibilityOf(element(by.id('error'))), browser.params.waitElementLoad,
        'Сообщение об ошибке не отобразилось');
      await expect(element(by.id('error')).getText()).to.eventually.equal(browser.params.captions.errorNoPassword,
        'Неверное сообщение об ошибке');
    });
    it('Проверка ошибки при попытке авторизации под случайным логином и паролем', async function () {
      let userName = crypto.randomBytes(8).toString('hex');
      let userPassword = crypto.randomBytes(10).toString('hex');
      await you.enterTextInField(userName, 'username');
      await you.enterTextInField(userPassword, 'password');
      await browser.wait(EC.visibilityOf(element(by.id('authbutton'))), browser.params.waitElementLoad,
        'Кнопка авторизации не отобразилась');
      await element(by.id('authbutton')).click();
      await browser.wait(EC.visibilityOf(element(by.id('error'))), browser.params.waitElementLoad,
        'Сообщение об ошибке не отобразилось');
      await expect(element(by.id('error')).getText()).to.eventually.equal(browser.params.captions.errorMessage,
        'Неверное сообщение об ошибке');
    });
    it('Авторизация под заданной учетной записью ' + browser.params.auth.username, async function () {
      await you.enterTextInField(browser.params.auth.username, 'username');
      await you.enterTextInField(browser.params.auth.password, 'password');
      await browser.wait(EC.visibilityOf(element(by.id('authbutton'))), browser.params.waitElementLoad,
        'Кнопка авторизации не отобразилась');
      await element(by.id('authbutton')).click();
      await expect(element(by.id('error')).isPresent()).to.eventually.equal(false, 'Отображается сообщение об ошибке,' +
        ' авторизация не удалась');
      await browser.wait(EC.urlContains(browser.params.serverURL + browser.params.path.modulePrefix),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует стартовой странице');
    });
  });
});
