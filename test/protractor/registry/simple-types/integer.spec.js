/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* globals browser, expect, protractor, element, it, describe */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));

//TODO Дублируется id!

const createdElement = (function () {
        return (Math.pow(-1, Math.floor(Math.random() * 2)) * Math.floor(Math.random() * 10000)).toString();
      })();

describe('Проверка операций над типом 4 "Целое"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_integer');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_integer'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_integer_integer_integer');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      var id = 'a_develop-and-test_class_integer_id';
      browser.wait(EC.presenceOf(element(by.id(id))), browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id(id)).getAttribute('value')).to.eventually.have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});