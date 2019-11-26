/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 26.01.2018.
 */
/* globals browser, element, by, protractor*/
const assert = require('assert');


/**
 * В модальном окне ВЫБОРА выделяет один из элементов и нажимает кнопку "Выбрать".
 * Глубина{@link DEEPNESS} уменьшается на 1.
 * @param {Number} row - номер строки, которая будет выделена.
 */
exports.pressModalSelect = async function (row){
  assert(typeof row === 'number', 'В качестве переменной row передано ' +
    'не число');
  await browser.wait(EC.invisibilityOf(element(by.className('table-loading'))),
    browser.params.waitElementLoad, 'Таблица с элементами не отображается');
  await element(by.id('list-manager')).element(by.tagName('tbody')).all(by.tagName('tr')).get(row).click();
  await element(by.className('select btn')).click();
  this.deepness--;
  await this.reselectFrame();
};
/**
 * Нажать кнопку "Создать" на модальном окне. Фокус сбрасывается, необходимо выбрать фрейм заново.
 * Глубина {@link DEEPNESS} увеличивается на 1.
 */
module.exports.pressModalCreate = async function tableCreate() {
  await browser.wait(EC.presenceOf(element(by.className('create btn'))),
    browser.params.waitElementLoad, 'Кнопка "Создать" не загружена');
  await browser.wait(EC.visibilityOf(element(by.className('create btn'))),
    browser.params.waitElementLoad, 'Кнопка "Создать" не отображается');
  await element(by.className('create btn')).click();
  this.deepness++;
  await this.reselectFrame();
};
/**
 * Нажать кнопку "Сохранить" на модальном окне. Фокус сбрасывается, необходимо выбрать фрейм заново.
 * Глубина {@link DEEPNESS} остаётся такой же.
 */
module.exports.pressModalSave = async function () {
  await browser.wait(EC.presenceOf(element(by.className('SAVE command btn'))), browser.params.waitElementLoad,
    'Кнопка "Сохранить" не загружена');
  await browser.wait(EC.visibilityOf(element(by.className('SAVE command btn'))), browser.params.waitElementLoad,
    'Кнопка "Сохранить" не отображается');
  await element(by.className('SAVE command btn')).click();
  await this.reselectFrame();
};
/**
 * Нажать кнопку "Сохранить и закрыть" на модальном окне. Текущий фрейм закрывается.
 * Глубина {@link DEEPNESS} уменьшается на 1.
 */
module.exports.pressModalSaveNClose = async function () {
  await browser.wait(EC.presenceOf(element(by.className('SAVEANDCLOSE command btn'))),
    browser.params.waitElementLoad, 'Кнопка "Сохранить и закрыть" не загружена');
  await browser.wait(EC.visibilityOf(element(by.className('SAVEANDCLOSE command btn'))),
    browser.params.waitElementLoad, 'Кнопка "Сохранить и закрыть" не отображается');
  await element(by.className('SAVEANDCLOSE command btn')).click();
  this.deepness--;
  await this.reselectFrame();
};
/**
 * Нажать кнопку "Закрыть" на модальном окне. Текущий фрейм закрывается.
 * Глубина {@link DEEPNESS} уменьшается на 1.
 */
//TODO Стоит предусмотреть случай, когда объект не сохранён
module.exports.pressModalClose = async function () {
  await browser.wait(EC.presenceOf(element(by.className('imodal-close'))),
    browser.params.waitElementLoad, 'Кнопка "Закрыть" не отображается');
  await browser.wait(EC.elementToBeClickable(element(by.className('imodal-close'))),
    browser.params.waitElementLoad, 'Кнопка "Закрыть" не отображается');
  await element(by.className('imodal-close')).click();
  this.deepness--;
  await this.reselectFrame();
};
/**
 * Вводим текст в input.
 * @param {String|Number} value - То, что мы вводим в поле
 * @param {String} inputId - id поля в которое мы вводим значение
 */
module.exports.enterTextInField = async function (value, inputId) {
  assert(typeof inputId === 'string', 'В качестве переменной inputId передана не строка');
  assert(typeof value === 'string' || typeof value === 'number', 'В качестве переменной value передана ' +
    'не строка или число');
  await browser.wait(EC.visibilityOf(element(by.id(inputId))), browser.params.waitElementLoad,
    'Поле ввода не отобразилось');
  await browser.actions()
    .mouseMove(element(by.id(inputId))).click()
    .keyDown(protractor.Key.CONTROL)
    .sendKeys(protractor.Key.HOME)
    .keyDown(protractor.Key.SHIFT)
    .sendKeys(protractor.Key.END)
    .keyUp(protractor.Key.CONTROL)
    .keyUp(protractor.Key.SHIFT)
    .sendKeys(value)
    .perform();
};
