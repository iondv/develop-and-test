/**
 * Created by YouTHFooL on 23.08.2016.
 */
// Тест проверки верстки шаблона страницы модуля
'use strict';

var startPage = require('./template-page-object.js');
var serverURL = browser.params.serverURL + browser.params.path.modulePrefix;
var EC = protractor.ExpectedConditions;

describe.skip('Проверка верстки модуля регистра и ключевых элементов', function () {
  before(function () {
    browser.getCurrentUrl()
      .then(expectedUrl => {
        if (!~expectedUrl.indexOf(serverURL)) {
          browser.get(browser.params.serverURL);
          browser.actions().mouseMove(element(by.id('username')))
            .click().sendKeys(browser.params.auth.username).mouseMove(element(by.id('password')))
            .click().sendKeys(browser.params.auth.password).mouseMove(element(by.id('authbutton')))
            .click().perform()
            .then(function () {
              browser.wait(EC.urlContains(serverURL), browser.params.waitElementLoad);
            });
        }
      });
  });
  describe('Шаг 1. Проверка шапки модуля', function () {
    it('Проверка отображения шапки модуля', function () {
      startPage.checkHeaderDisplayed();
    });
    it('Проверка отображения кнопки меню', function () {
      startPage.checkHeaderMenuDisplayed();
    });
    it('Проверка клика на кнопку меню', function () {
      startPage.checHeaderMenuClick();
    });
    it('Проверка отображения логотипа', function (done) {
      startPage.checkHeaderLogoDisplayed(done);
    });
    it('Проверка клика на логотип', function () {
      startPage.checkHeaderLogoClick();
    });
    it('Проверка блока пользователя', function (done) {
      startPage.checkUserBlockDisplayed(done);
    });
    it('Проверка нажатия на ссылку пользователя', function () {
      startPage.checkUserBlockClick();
    });
  });
  describe('Шаг 2. Проверка боковой панели модуля', function () {
    it('Проверка отображения боковой панели модуля', function () {
      startPage.checkAsideDisplayed();
    });
    it('Проверка отображения меню боковой панели', function () {
      startPage.checkAsideMenuDisplayed();
    });
    it('Проверка нажатия на кнопку меню', function () {
      startPage.checkAsideMenuClick();
    });
    it('Проверка отображения кнопки сворачивания боковой панели', function () {
      startPage.checkAsideButtonDisplayed();
    });
    it('Проверка нажатия на кнопку сворачивания боковой панели', function () {
      startPage.checkAsideButtonClick();
    });
    it('Проверка отображения меню при свернутой боковой панели', function () {
      startPage.checkAsideMenuHover();
    });
    it('Проверка повторного нажатия на кнопку сворачивания', function () {
      startPage.checkAsideButtonSecondClick();
    });
  });
  describe('Шаг 3. Проверка центрального блока модуля', function () {
    it('Проверка отображения центрального блока модуля', function () {
      startPage.checkMiddleDisplayed();
    });
    it('Проверка заголовка центрального блока', function () {
      startPage.checkMiddleTitle();
    });
    it('Проверка отображения "хлебных крошек"', function () {
      startPage.checkMiddleBreadcrumbDisplayed();
    });
  });
});