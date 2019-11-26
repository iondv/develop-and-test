/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 30.01.2018.
 */

/* globals describe, before, it, protractor, browser, expect, element, by */
/**
 * Функция проверки корректности УРЛ, заголовка мтраницы, заголовка центрального блока и списка объектов
 * страницы соответствующего простого типа
 */
const you = Object.assign(require('../../util/list'),
  require('../../util/entity'),
  require('../../util/filter'),
  require('../../util/frame'));

const crypto = require('crypto');
const createdElement = 'Пушкин';
const editedElement = 'Лермонтов';
const inlineEditedElement = 'Бальзак';
let idOfElement;
let rightPassedStage;

describe(`Проверка функционала в типе "Строка"[0]. `, () => {
  before(() => {
    browser.get(browser.params.serverURL + '/registry/develop-and-test@class_string');
  });
  describe('Шаг 1. Создание объекта соответствующего класса', () => {
    it('Проверка вёрстки страницы', async () => {
      await browser.wait(EC.urlIs(browser.params.serverURL + '/registry/develop-and-test@class_string'),
        browser.params.waitPageLoad, 'Адрес страницы не соответствует странице класса');
      await expect(browser.getTitle()).to.eventually.equal('ION Platform',
        'Заголовок страницы не соответствует странице модуля');
      await expect(element(by.css('li[class=" active"]')).getText()).to.eventually.contain('Класс "Строка [0]"',
        'Заголовок центрального блока страницы не соответствует странице' +
        ' списка объектов класса');
      await browser.wait(EC.presenceOf(element.all(by.css('#content div.dataTables_scrollBody tbody tr')).get(0)),
        browser.params.waitElementLoad, 'Список объектов класса пуст');
    });
    it('Нажимаем "Cоздать"', async function () {
      await you.pressCreate();
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(createdElement, 'a_develop-and-test_class_string_string_text');
    });   
    it('Нажимаем "Cохранить"', async function () {
      await you.pressModalSave();
    });
    it('Проверка появления id нового элемента', () => {
      browser.wait(EC.presenceOf(element(by.id('a_develop-and-test_class_string_id'))),
        browser.params.waitElementLoad, 'Не получается загрузить id');
      element(by.id('a_develop-and-test_class_string_id')).getAttribute('value')
        .then(function (objectId) {
          idOfElement = objectId;
        });
    });
    it('Нажимаем "Закрыть"', async function () {
      await you.pressModalClose();
    });
    it('Проверка наличия созданного объекта в списке', async () => {
      let firstRowText = await you.filter(idOfElement, 0);
      expect(firstRowText.length).to.be.above(0, 'Не найден id создваного эемента');
      expect(firstRowText.length > 1).to.be.equal(false, 'Найдено больше 1 элемента с созданным id');
      expect(firstRowText[0].indexOf(createdElement) !== -1).to.be.equal(true, 'Значение созданного элемента не' +
        ' совпадает с эталонным');
      rightPassedStage = 'creation';
    });
  });
  describe('Шаг 2. Проверка редактирования инлайн', () => {
    before(() => {
      expect(rightPassedStage).to.be.equal('creation', 'Элемент не был создан. Нечего изменять');
    });
    it('Выбираем для редактирования инлайн', async function () {
      await you.inlineEdit(0);
    });
    it('Проверка, что в поле - значение, введенное на шаге 1', async () => {
      await browser.wait(EC.visibilityOf(element(by.id('a_develop-and-test_class_string_string_text'))), 15000,
      'Поля ввода не видно');
      let inlineText = await element(by.id('a_develop-and-test_class_string_string_text'))
        .getAttribute('value');
      await expect(inlineText).to.equal(createdElement, 'Открылся фрейм с неверным объектом');
      await you.enterTextInField(inlineEditedElement, 'a_develop-and-test_class_string_string_text');
    });
    it('Нажимаем "Cохранить и закрыть"', async function () {
      await you.inlineSave();
    });
    it('Проверка наличия измененнного и отсутствия старого объекта в списке', async () => {
      await you.pressFilter();
      let firstRowText = await you.filter(idOfElement, 0);
      expect(firstRowText.length).to.be.above(0, 'Не найден id создваного эемента');
      expect(firstRowText.length > 1).to.be.equal(false, 'Найдено больше 1 элемента с созданным id');
      expect(firstRowText[0].indexOf(inlineEditedElement) !== -1).to.be.equal(true, 'В отфиьтрованной по id строке нет' +
        ' отредактированного значения');
      rightPassedStage = 'inlineEdition';
    });
  });
  describe('Шаг 3. Правка объекта соответствующего класса', () => { // TODO - в связи с включением инлайн редактирования - теперь клик открывает обеъкт, а не выделяет его.
    before(() => {
      expect(typeof rightPassedStage).to.be.equal('string', 'Элемент не был создан. Нечего изменять');
    });
    it('Выбираем', async function () {
      await you.edit(0);
    });
    it('Проверка, что в поле - значение, введенное на шаге 1', () => {
      element(by.id('a_develop-and-test_class_string_string_text')).getWebElement()
        .then(function (elem) {
          return elem.getAttribute('value');
        })
        .then(function (value) {
          expect(value).to.equal(inlineEditedElement, 'Открылся фрейм с неверным объектом');
        });
    });
    it('Вводим значение', async function () {
      await you.enterTextInField(editedElement, 'a_develop-and-test_class_string_string_text');
    });
    it('Нажимаем "Cохранить и закрыть"', async function () {
      await you.pressModalSaveNClose();
    });
    it('Проверка наличия измененнного и отсутствия старого объекта в списке', async () => {
      await you.pressFilter();
      let firstRowText = await you.filter(idOfElement, 0);
      expect(firstRowText.length).to.be.above(0, 'Не найден id создваного эемента');
      expect(firstRowText.length > 1).to.be.equal(false, 'Найдено больше 1 элемента с созданным id');
      expect(firstRowText[0].indexOf(editedElement) !== -1).to.be.equal(true, 'В отфиьтрованной по id строке нет' +
        ' отредактированного значения');
      rightPassedStage = 'edition';
    });
  });
  describe('Шаг 4. Проверка удаления объекта, созданного в процессе тестирования', () => { // TODO аналогично выше
    before(() => {
      expect(typeof rightPassedStage).to.be.equal('string', 'Элемент не был создан. Нечего удалять');
    });
    it('Удаляем', async function () {
      await you.erase(0);
    });
    it('Проверка отсутствия созданного объекта', async () => {
      await you.pressFilter();
      let firstRowText = await you.filter(idOfElement, 0);
      expect(firstRowText.length).to.be.equal(0, 'Найден id созданного эемента');
      rightPassedStage = 'deleted';
    });
  });
});

