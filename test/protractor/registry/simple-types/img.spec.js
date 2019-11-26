/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* Параметры jshint */
/* globals browser, expect, protractor */
/**
 * Функция проверки корректности УРЛ, заголовка мтраницы, заголовка центрального блока и списка объектов
 * страницы соответствующего простого типа
 */

'use strict';

const createdElement = (function (val) {
        if (val === 'a.jpg') {
          return 'b.jpg';
        } else {
          if (val === 'b.jpg') {
            return 'a.jpg';
          } else {
            return Math.floor(Math.random() * 10) < 5 ? 'a.jpg' : 'b.jpg';
          }
        }
      })();

const path = require('path');

describe.skip('Проверка операций над типом 13 "Изображение"', function () { //TODO Не может найти файл
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_img');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_img'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', function (done) {
      var inputField = 'a_develop-and-test_class_img_img_img';
      let filePath =  path.join(__dirname, createdElement);
      element(by.xpath('//input[@id = "' + inputField + '"]/following-sibling::div[1]/input[1]'))
        .sendKeys(filePath);
      browser.wait(EC.visibilityOf(element(by.className('done'))),
          browser.params.waitElementLoad * 3, 'Файл не загружен');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      var id = 'a_develop-and-test_class_img_id';
      browser.wait(EC.presenceOf(element(by.id(id))), browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id(id)).getAttribute('value')).to.eventually.have.length.above(0);
    });
  });
});
