/* globals browser, expect, protractor */
const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
const crypto = require('crypto');
const createdElement = crypto.randomBytes(14).toString('hex');

describe('Проверка операций над типом 0 "Строка"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_string');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_string'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_string_string_text');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_class_string_id'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id('a_develop-and-test_class_string_id')).getAttribute('value')).to.eventually
        .have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});