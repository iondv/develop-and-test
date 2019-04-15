/**
 * Created by YouTHFooL on 23.08.2016.
 */
// Page object теста проверки верстки шаблона страницы модуля
'use strict';
/* Параметры jshint */
/* globals browser.params. expect, protractor */

var request = require('supertest');
var serverURL = browser.params.serverURL + browser.params.path.modulePrefix;
var EC = protractor.ExpectedConditions;

var TemplatePage = function () {

  /**
   * Функция проверки отображения шапки модуля
   */
  this.checkHeaderDisplayed = function () {
    expect(element(by.id('header')).isDisplayed()).to.eventually.equal(true, 'Шапка модуля не отображается');
  };

  /**
   * Функция проверки отображения кнопки меню шапки модуля
   */
  this.checkHeaderMenuDisplayed = function () {
    expect(element(by.css('#header ul.nav.pull-left a.dropdown-toggle')).isDisplayed()).to.eventually.equal(true,
      'Кнопка меню не отображается');
  };

  /**
   * Функция проверки клика на кнопку меню шапки модуля
   */
  this.checHeaderMenuClick = function () {
    element(by.css('#header ul.nav.pull-left a.dropdown-toggle')).click().then(function () {
      expect(element(by.css('#header ul.nav.pull-left ul.dropdown-menu')).isDisplayed()).to
        .eventually.equal(true, 'Выпадающее меню не отображается');
    }).then(function () {
      element(by.css('#header ul.nav.pull-left a.dropdown-toggle')).click().then(function () {
        expect(element(by.css('#header ul.nav.pull-left ul.dropdown-menu')).isDisplayed()).to
          .eventually.equal(false, 'Выпадающее меню отображается, после повторного нажатия на кнопку меню');
      });
    });
  };

  /**
   * Функция проверки отображения логотипа модуля
   * @param {callback} done - Параметр-колбэк для ожидания завершения выполнения функции
   */
  this.checkHeaderLogoDisplayed = function (done) {
    expect(element(by.css('#header span.logo')).isDisplayed()).to.eventually.equal(true, 'Логотип не отображается');
    expect(element(by.css('#header span.logo img')).isDisplayed()).to.eventually.equal(true,
      'Изображение логотипа не отображается');
    element(by.css('#header span.logo img')).getAttribute('src').then(function (url) {
      request(serverURL)
        .get(url.toString().slice(serverURL.length))
        .expect(302, done);
    });
  };

  /**
   * Функция проверки клика на логотип модуля
   */
  this.checkHeaderLogoClick = function () {
    expect(element(by.css('#header span.logo a')).getAttribute('href')).to.eventually.equal(serverURL,
      'Ссылка логотипа не ведет на стартовую страницу модуля');
    element(by.css('#header span.logo a')).click().then(function () {
      expect(browser.getCurrentUrl()).to.eventually.contain(serverURL + '/',
        'После клика на логотип адрес страницы не соответствует стартовой странице');
      expect(browser.getTitle()).to.eventually.equal(browser.params.title.startPage,
        'После клика на логотип заголовок страницы не соответствует стартовой странице');
    });
  };

  /**
   * Функция проверки отображения блока пользователя шапки
   * @param {callback} done - Параметр-колбэк для ожидания завершения выполнения функции
   */
  this.checkUserBlockDisplayed = function (done) {
    expect(element(by.css('#header ul.nav.pull-right a.dropdown-toggle')).isDisplayed()).to.eventually.equal(true,
      'Блок пользователя не отображается');
    expect(element(by.css('#header ul.nav.pull-right img')).isDisplayed()).to.eventually.equal(true,
      'Изображение пользователя не отображается');
    element(by.css('#header ul.nav.pull-right img')).getAttribute('src').then(function (url) {
      request(serverURL)
        .get(url.toString().slice(serverURL.length))
        .expect(302, done);
    });
  };

  /**
   * Функция проверки клика на блок пользователя
   */
  this.checkUserBlockClick = function () {
    element(by.css('#header ul.nav.pull-right a.dropdown-toggle')).click().then(function () {
      expect(element(by.css('#header ul.nav.pull-right ul.dropdown-menu')).isDisplayed()).to
        .eventually.equal(true, 'Выпадающее меню не отображается');
      expect(element(by.css('#header ul.nav.pull-right ul.dropdown-menu a')).getText()).to
        .eventually.equal(browser.params.captions.logout, 'Подпись кнопки выхода пользователя не верна');
      expect(element(by.css('#header ul.nav.pull-right ul.dropdown-menu a')).getAttribute('href')).to
        .eventually.equal(serverURL + browser.params.path.logout, 'Ссылка кнопки выхода пользователя не верна');
    }).then(function () {
      element(by.css('#header ul.nav.pull-right a.dropdown-toggle')).click().then(function () {
        expect(element(by.css('#header ul.nav.pull-right ul.dropdown-menu')).isDisplayed()).to
          .eventually.equal(false, 'Выпадающее меню отображается, после повторного нажатия на кнопку пользователя');
      });
    });
  };

  /**
   * Функция проверки отображения боковой панели модуля
   */
  this.checkAsideDisplayed = function () {
    expect(element(by.id('aside')).isDisplayed()).to.eventually.equal(true, 'Боковая панель не отображается');
  };

  /**
   * Функция проверки отображения меню боковой панели модуля
   */
  this.checkAsideMenuDisplayed = function () {
    expect(element(by.id('sideNav')).isDisplayed()).to.eventually.equal(true,
      'Меню боковой панели не отображается');
    expect(element.all(by.css('#sideNav li.el_primary')).count()).to.eventually.not.equal(0,
      'Нет ключевых элементов меню');
    expect(element(by.id('el_0')).isDisplayed()).to.eventually.equal(true,
      'Ключевые элементы боковой панели не отображаются');
  };

  /**
   * Функция проверки клика на меню боковой панели модуля
   */
  this.checkAsideMenuClick = function () {
    if (element(by.id('el_0')).getAttribute('class').getText() === 'treeview el_primary') {
      element(by.id('el_0')).click();
    }
    element(by.id('el_0')).click().then(function () {
      expect(element(by.id('el_0')).getAttribute('class')).to.eventually.equal('treeview el_primary');
    });
  };

  /**
   * Функция проверки отображения кнопки сворачивания боковой панели модуля
   */
  this.checkAsideButtonDisplayed = function () {
    expect(element(by.id('mobileMenuBtn')).isDisplayed()).to.eventually.equal(true,
      'Кнопка сворачивания боковой панели не отображается');
  };

  /**
   * Функция проверки клика на кнопку сворачивания боковой панели модуля
   */
  this.checkAsideButtonClick = function () {
    browser.wait(EC.elementToBeClickable(element(by.id('mobileMenuBtn'))), browser.params.waitElementLoad);
    element(by.id('mobileMenuBtn')).click().then(function () {
      browser.wait(function () {
        return element(by.id('aside')).getCssValue('width').then(function (width) {
          return width === '50px';
        });
      }, browser.params.waitElementLoad);
    });
  };

  /**
   * Функция проверки отображения выпадающего меню при наведении в режиме свернутой боковой панели
   */
  this.checkAsideMenuHover = function () {
    browser.actions().mouseMove(element(by.id('sideNav'))).perform();
    expect(element(by.id('el_0')).isDisplayed()).to.eventually.equal(true,
      'Ключевые элементы боковой панели не отображаются');
  };

  /**
   * Функция повторного клика на кнопку сворачивания боковой панели модуля
   */
  this.checkAsideButtonSecondClick = function () {
    element(by.id('mobileMenuBtn')).click().then(function () {
      browser.wait(function () {
        return element(by.id('aside')).getCssValue('width').then(function (width) {
          return width === '300px';
        });
      }, browser.params.waitElementLoad);
    });
  };

  /**
   * Функция проверки отображения центрального блока модуля
   */
  this.checkMiddleDisplayed = function () {
    expect(element(by.id('middle')).isDisplayed()).to.eventually.equal(true, 'Центральный блок модуля не отображается');
  };

  /**
   * Функция проверки заголовка центрального блока модуля
   */
  this.checkMiddleTitle = function () {
    expect(element(by.css('#page-header h1')).isDisplayed()).to
      .eventually.equal(true, 'Заголовок центрального блока не отображается');
    expect(element(by.css('#page-header h1')).getText()).to
      .eventually.equal(browser.params.captions.startPageHeader, 'Неверный текст заголовка центрального блока');
  };

  /**
   * Функция проверки отображения "хлебных крошек" центрального блока модуля
   */
  this.checkMiddleBreadcrumbDisplayed = function () {
    expect(element(by.css('#page-header .breadcrumb')).isDisplayed()).to
      .eventually.equal(true, 'Хлебные крошки не отображаются');
    element(by.css('#page-header .breadcrumb')).getText().then(function (text) {
      expect(text.length).to.not.equal(0, 'Текст хлебных крошек пуст');
    });
  };
};
module.exports = new TemplatePage();
