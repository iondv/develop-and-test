/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* globals browser, expect, protractor */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
const createdElement = (function () {
        return (Math.pow(-1, Math.floor(Math.random() * 2)) * Math.floor(Math.random() * 100000000) / 10000).toString();
      })();

describe('Проверка операций над типом 5 "Действительное"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_real');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_real'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_real_real_real');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_class_real_id'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id('a_develop-and-test_class_real_id')).getAttribute('value')).to.eventually
        .have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});
