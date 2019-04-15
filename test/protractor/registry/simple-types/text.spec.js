/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* globals browser, expect, protractor */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
const crypto = require('crypto');
const createdElement = crypto.randomBytes(15).toString('hex');
const bombImodal = require('../../util/iterance').bombImodal;

describe('Проверка операций над типом 1 "Текст"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_text');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_text'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_text_text_multilinetext');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_class_text_id'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id('a_develop-and-test_class_text_id')).getAttribute('value'))
        .to.eventually.have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});
