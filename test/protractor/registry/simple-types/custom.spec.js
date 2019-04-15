/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 22.05.2017.
 */
/* globals browser, expect, protractor */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));
const createdElement = (function () {
        var rand = (Math.floor(Math.random() * 10000000000) - 1).toString();
        var value = rand;
        while (value.length < 10) {
          value = value + '0';
        }
        return value.substr(0, 2) + ' ' + value.substr(2, 2) + ' ' + value.substr(4);
      })();

describe('Проверка операций над типом 14 "Пользовательский тип"', function () {
  before(function () {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_custom');
    browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_custom'));
  });
  describe('Шаг 1. Создание объекта соответствующего класса', function () {
    it('Нажимаем создать', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_custom_passport');
    });
    it('Нажимаем сохранить', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', function () {
      var id = 'a_develop-and-test_class_custom_id';
      browser.wait(EC.presenceOf(element(by.id(id))), browser.params.waitElementLoad, 'Не получается загрузить id');
      expect(element(by.id(id)).getAttribute('value')).to.eventually.have.length.above(0);
    });
  });
  after(function () {
    you.leavePageUnclosed();
  });
});
