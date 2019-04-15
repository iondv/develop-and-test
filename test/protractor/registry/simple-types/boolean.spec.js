/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* globals browser, expect, protractor, element */

const you = Object.assign(require('../../util/list'),
                          require('../../util/entity'),
                          require('../../util/filter'),
                          require('../../util/frame'));

describe('Проверка операций над типом 15 "Логический [10]" nullable:false - двухпозиционный"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_boolean.double');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_boolean.double'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await browser.wait(EC.visibilityOf(element(by.className('icheckbox_flat'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      await element(by.className('icheckbox_flat')).click();
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      var id = 'a_develop-and-test_class_boolean_id';
      browser.wait(EC.presenceOf(element(by.id(id))), browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id(id)).getAttribute('value')).to.eventually.have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});
