/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 25.01.2018.
 */
/* globals browser, expect, protractor, element, by */

const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'),
  require('../../util/iterance'));
let firstCollection = ['Принц', 'Ханс'];
let secondCollection = ['Принцесса', 'Алла'];
let firstId = [];
let secondId = [];

describe('Проверка поведения ссылки 1 к 1', function (){
  describe('Создание объектов класса 1', function () {
    it('Переход на страницу класса 1', function () {
      browser.get(browser.params.serverURL + '/registry/develop-and-test@classRef.references.ref');
      browser.wait(EC.urlContains(browser.params.serverURL +
          '/registry/develop-and-test@classRef.references.ref'),
        browser.params.waitElementLoad, 'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Ссылка для связи 1к1: ' +
        'Ссылка для связи 1к1', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    for (let i = 0; i < firstCollection.length; i++) {
      it('Создание объекта ' + firstCollection[i], async function () {
        var idid = 'a_develop-and-test_otorbrRef_id';
        await you.pressCreate();
        await you.enterTextInField(firstCollection[i], 'a_develop-and-test_otorbrRef_data');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id(idid))), browser.params.waitElementLoad,
          'Не получается загрузить id');
        let id = await element(by.id(idid)).getAttribute('value');
        expect(id.length).to.be.above(0, 'Id не появился');
        firstId.push(id);
        await you.pressModalClose();
      });
    }
  });
  describe('Создание объектов класса 2', function () {
    let url = '/registry/develop-and-test@classRef.references.backRef';
    it('Переход на страницу класса 2', function () {
      browser.get(browser.params.serverURL + url);
      browser.wait(EC.urlContains(browser.params.serverURL + url), browser.params.waitElementLoad,
        'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Обратная ссылка для связи 1к1:' +
        ' Обратная ссылка для связи 1к1', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    for (let i = 0; i < secondCollection.length; i++) {
      it('Создание объекта ' + secondCollection[i], async function () {
        let idid = 'a_develop-and-test_otorbrBackRef_id';
        await you.pressCreate();
        await you.enterTextInField(secondCollection[i], 'a_develop-and-test_otorbrBackRef_data');
        await you.pressModalSave();
        await browser.wait(EC.presenceOf(element(by.id(idid))), browser.params.waitElementLoad,
          'Не получается загрузить id');
        let id = await element(by.id(idid)).getAttribute('value');
        expect(id.length).to.be.above(0, 'Id не появился');
        secondId.push(id);
      });
      it('Привязываем элемент ' + firstCollection[i], async function () {
        await you.tableChoose();
        await you.filter(firstId[i], 0);
        await you.pressModalSelect(0);
        await you.pressModalSave();
        let refVal = element(by.id('a_develop-and-test_otorbrBackRef_backref'));
        await browser.wait(EC.presenceOf(refVal), browser.params.waitElementLoad, 'Поле со ссылкой не загрузилось');
        expect(refVal.getAttribute('value')).to.be.eventually.equal(firstId[i],
          'Элемент ' + firstCollection[i] + ' не привязался');
      });
      it('Переходим к следующему объекту', async function () {
        await you.pressModalClose();
      });
    }

  });
  describe('Проверяем поведение 1 к 1', function () {
    let url = '/registry/develop-and-test@classRef.references.ref';
    it('Пробуем привязать уже связанный элемент ' + firstCollection[0], async function () {
      await you.filter(secondId[0], 0);
      await you.edit(0);
      await you.tableChoose();
      await you.filter(firstId[0], 0);
      await you.pressModalSelect(0);
      await you.iteranceSwitchToImodal(100);
      await browser.wait(EC.visibilityOf(element(by.id('ui-id-1'))), browser.params.waitElementLoad,
        'диалоговое окно не появилось');
      browser.refresh();
      await you.leavePageUnclosed();
    });
    it('Переход на страницу класса 1', function () {
      browser.get(browser.params.serverURL + url);
      browser.wait(EC.urlContains(browser.params.serverURL + url), browser.params.waitElementLoad,
        'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Ссылка для связи 1к1: ' +
        'Ссылка для связи 1к1', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    //TODO Поведение 1 к 1 сейчас не работает в обратную сторону
    it.skip('Пробуем привязать уже связанный элемент ' + secondCollection[1], async function () {
      await you.filter(firstId[0], 0);
      await you.edit(0);
      await you.tableChoose();
      await you.filter(secondId[1], 0);
      await you.pressModalSelect(0);
      await you.pressModalSave();
      await browser.sleep(111111);
      await browser.wait(EC.visibilityOf(element(by.id('message-callout'))), browser.params.waitElementLoad,
        'Сообщение об ошибке не появилось');
      browser.refresh();
      await you.leavePageUnclosed();
    });
  });
  describe('Удаляем созданные объекты', function () {
    let url = '/registry/develop-and-test@classRef.references.backRef';
    for (let i = 0; i < firstCollection.length; i++) {
      it('Удаление объекта ' + firstCollection[i], async function () {
        await you.filter(firstId[i], 0);
        await you.erase(0);
        await you.pressFilter(0);
      });
    }
    it('Переход на страницу класса 2', function () {
      browser.get(browser.params.serverURL + url);
      browser.wait(EC.urlContains(browser.params.serverURL + url), browser.params.waitElementLoad,
        'Адрес страницы не соответствует искомой');
      expect(element(by.css('.middle-title')).getText()).to.eventually.contain('Обратная ссылка для связи 1к1:' +
        ' Обратная ссылка для связи 1к1', 'Заголовок центрального блока страницы не соответствует странице списка ' +
        'объектов');
    });
    for (let i = 0; i < secondCollection.length; i++) {
      it('Удаление объекта ' + secondCollection[i], async function () {
        await you.filter(secondId[i], 0);
        await you.erase(0);
        await you.pressFilter(0);
      });
    }
  });
});
