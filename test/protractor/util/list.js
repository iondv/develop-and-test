/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 26.01.2018.
 */
/* globals browser, element, by*/
const assert = require('assert');

/**
 * Номер таблицы с которой работает полоьзователь.
 * @type {number}
 */
module.exports.tableNumber = 0;

/**
 * Функция для проверки наличия выбора таблицы, с которой нужно раблтать.
 * @param number {Number} - номер таблицы с которой будет происходить работа.
 * @returns {ElementFinder} - {@link http://www.protractortest.org/#/api?view=ElementFinder} элемент веб страницы
 * полученный с помощью функци protractor.
 */
module.exports.workWithTable = async function workWithTable(number) {
  assert(typeof number === 'number', 'В качестве переменной number передано ' +
    'не число');
  if(number === 0) {
    await browser.wait(EC.visibilityOf(element.all(by.className('dataTables_wrapper')).get(number)),
      browser.params.waitElementLoad, 'Нет ни единой таблицы, с которой можно было бы работать');
  } else {
    await browser.wait(EC.visibilityOf(element.all(by.className('dataTables_wrapper')).get(number)),
      browser.params.waitElementLoad, 'Таблица ' + number + ' с которой вы хотите работать не отображается');
  }
  this.tableNumber = number;
  return element.all(by.className('dataTables_wrapper ')).get(number);
};
/**
 * Нажать кнопку "Создать". Фокус сбрасывается, необходимо выбрать фрейм заново.
 * Глубина {@link DEEPNESS} увеличивается на 1.
 */
module.exports.pressCreate = async function () {
  await browser.wait(EC.presenceOf(element(by.className('create btn'))),
    browser.params.waitElementLoad, 'Кнопка "Создать" не загружена');
  await browser.wait(EC.visibilityOf(element(by.className('create btn'))),
    browser.params.waitElementLoad, 'Кнопка "Создать" не отображается');
  await element(by.className('create btn')).click();
  this.deepness++;
  await this.reselectFrame();
};
/**
 * Удалить элемент на row строке в таблице.
 * @param row {Number} - строка, которую функция выберет для удаления.
 * @param {Number} [table=0] - номер таблицы с которой будет работа. По умолчанию 0.
 */
module.exports.erase = async function (row, table){
  assert(typeof row === 'number', 'В качестве переменной row передано ' +
    'не число');
  table = table || await module.exports.workWithTable(0);
  await browser.wait(EC.visibilityOf(table.element(by.tagName('tbody'))),
    browser.params.waitElementLoad, 'Тело таблицы не отобразилось');
  await browser.actions()
    .mouseMove(table.element(by.tagName('tbody')).all(by.tagName('tr')).get(row))
    .perform();
  await browser.wait(EC.visibilityOf(element.all(by.className('inline-form-control delete')).get(this.tableNumber)),
    browser.params.waitElementLoad, 'Кнопка удалить не отображается');
  await element.all(by.className('inline-form-control delete')).get(this.tableNumber).click();
  await browser.switchTo().alert().accept();
};
/**
 * Отсоединить элемент на row строке в таблице.
 * @param row {Number}- строка элемента, который будет отсоединён.
 * @param {Number} [tableNumber=0] - номер таблицы с которой будет работа. По умолчанию 0.
 */
module.exports.remove = async function (row, tableNumber){
  assert(typeof row === 'number', 'В качестве переменной row передано ' +
    'не число');
  tableNumber = tableNumber || 0;
  let tableObject = await module.exports.workWithTable(tableNumber);
  await browser.actions()
    .mouseMove(tableObject.element(by.tagName('tbody')).all(by.tagName('tr')).get(row))
    .perform();
  await browser.wait(EC.visibilityOf(element.all(by.className('inline-form-control remove')).get(tableNumber)),
    browser.params.waitElementLoad, 'Кнопка удалить не отображается');
  await element.all(by.className('inline-form-control remove')).get(tableNumber).click();
  await browser.switchTo().alert().accept();
  await this.reselectFrame();
};
/**
 * Редактировать элемент на row строке в таблице.
 * @param row {Number}- строка элемента, который будет выбран для редактирования.
 * @param {Number} [tableNumber=0] - номер таблицы с которой будет работа. По умолчанию 0.
 */
module.exports.edit = async function edit(row, tableNumber){
  assert(typeof row === 'number', 'В качестве переменной row передано ' +
    'не число');
  tableNumber = tableNumber || 0;
  let tableObject = await module.exports.workWithTable(tableNumber);
  await browser.wait(EC.visibilityOf(tableObject.element(by.tagName('tbody'))),
    browser.params.waitElementLoad, 'Тело таблицы не отобразилось');
  await expect(tableObject.element(by.tagName('tbody')).all(by.className('dataTables_empty')).count())
    .to.be.eventually.equal(0, 'Таблица пустая');
  await tableObject.element(by.tagName('tbody')).all(by.tagName('tr')).get(row).click();
  this.deepness++;
  await this.reselectFrame();
};
/**
 * Редактировать ИНЛАЙН элемент на row строке в таблице.
 * @param row {Number}- строка элемента, который будет выбран для редактирования инлайн.
 * @param {Number} [tableNumber=0] - номер таблицы с которой будет работа. По умолчанию 0.
 */
module.exports.inlineEdit = async function (row, tableNumber){
  assert(typeof row === 'number', 'В качестве переменной row передано ' +
    'не число');
  tableNumber = tableNumber || 0;
  let tableObject = await module.exports.workWithTable(tableNumber);
  await browser.actions()
    .mouseMove(tableObject.element(by.tagName('tbody')).all(by.tagName('tr')).get(row))
    .perform();
  await browser.wait(EC.visibilityOf(element.all(by.className('inline-form-control update')).get(tableNumber)),
    browser.params.waitElementLoad, 'Кнопка редактировать не отображается');
  await element.all(by.className('inline-form-control update')).get(tableNumber).click();
};
/**
 * Сохранить открытый на редактирование ИНЛАЙН элемент в таблице.
 * @param {Number} [tableNumber] - номер таблицы с которой будет работа.
 * Если не передан, берётся номер из переменной tableNumber.
 */
module.exports.inlineSave = async function (tableNumber){
  tableNumber = tableNumber || this.tableNumber;
  await browser.wait(EC.visibilityOf(element.all(by.className('inline-form-control save')).get(tableNumber)),
    browser.params.waitElementLoad, 'Кнопка сохранить не отображается');
  await element.all(by.className('inline-form-control save')).get(tableNumber).click();
};
/**
 * Закрыть открытый на редактирование ИНЛАЙН элемент в таблице.
 * @param {Number} [tableNumber] - номер таблицы с которой будет работа.
 * Если не передан, берётся номер из переменной tableNumber.
 */
module.exports.inlineCancel = async function (tableNumber){
  tableNumber = tableNumber || this.tableNumber;
  await browser.wait(EC.visibilityOf(element.all(by.className('inline-form-control cancel')).get(tableNumber)),
    browser.params.waitElementLoad, 'Кнопка отмена не отображается');
  await element.all(by.className('inline-form-control cancel')).get(tableNumber).click();
};
/**
 * Нажать на кнопку "Добавить" в модальном окне. Открывается новый фрейм на который надо преключиться.
 * Глубина {@link DEEPNESS} увеличивается на 1.
 * @param {Number} [tableNumber=0] - номер таблицы с которой будет работа. По умолчанию 0.
 */
module.exports.tableAdd = async function tableAdd(tableNumber) {
  tableNumber = tableNumber || 0;
  let tableObject = await module.exports.workWithTable(tableNumber);
  await browser.wait(EC.presenceOf(tableObject.element(by.className('add btn'))), browser.params.waitElementLoad,
    'Кнопка "Добавить" не загружена');
  await browser.wait(EC.elementToBeClickable(tableObject.element(by.className('add btn'))), browser.params.waitElementLoad,
    'Кнопка "Добавить" не отображается');
  await tableObject.element(by.className('add btn')).click();
  this.deepness++;
  await this.reselectFrame();
};
/**
 * Нажать кнопку "Cоздать" на модальном окне. Открывается фрейм на который надо переключиться.
 * Глубина {@link DEEPNESS} увеличивается на 1.
 * @param {Number} [tableNumber=0] - номер таблицы с которой будет работа. По умолчанию 0.
 */
module.exports.tableCreate = async function tableCreate(tableNumber) {
  tableNumber = tableNumber || 0;
  let tableObject = await module.exports.workWithTable(tableNumber);
  await browser.wait(EC.presenceOf(tableObject.element(by.className('create btn'))),
    browser.params.waitElementLoad, 'Кнопка "Создать" не загружена');
  await browser.wait(EC.visibilityOf(tableObject.element(by.className('create btn'))),
    browser.params.waitElementLoad, 'Кнопка "Создать" не отображается');
  await tableObject.element(by.className('create btn')).click();
  this.deepness++;
  await this.reselectFrame();
};
//TODO Попросить дать разные названия. Добавить работу с несколькими ссылками.
/**
 * ДЛЯ ССЫЛОК!!! (ТОЛЬКО ОДИН ЭЛЕМЕНТ)
 * Нажать кнопку "Выбрать" на модальном окне. Открывается фрейм на который надо переключиться.
 * Глубина {@link DEEPNESS} увеличивается на 1.
 */
module.exports.tableChoose = async function tableChoose() {
  await browser.wait(EC.presenceOf(element(by.className('select-btn btn'))), browser.params.waitElementLoad,
    'Кнопка "Выбрать" не загружена');
  await browser.wait(EC.visibilityOf(element(by.className('select-btn btn'))), browser.params.waitElementLoad,
    'Кнопка "Выбрать" не отображается');
  await element(by.className('select-btn btn')).click();
  this.deepness++;
  await this.reselectFrame();
};
//TODO Расширить формат вывода, добавить поддержку получения содержимого и из других страниц.
/**
 * Получить содержимое текущей страницы таблицы в виде массива, поля строки соединяются пробелами и
 * пердаются одной строкой.
 * @async
 * @param {Number} [tableNumber=0] - номер таблицы с которой будет работа. По умолчанию 0.
 * @returns {Array} - массив строк таблицы, каждая строка склеена пробелами.
 */
module.exports.getTablePage = async function getTablePage(tableNumber) {
  tableNumber = tableNumber || 0;
  let tableObject = await module.exports.workWithTable(tableNumber);
  await browser.wait(EC.visibilityOf(tableObject.all(by.tagName('tr'))
    .get(0)), browser.params.waitElementLoad, '0 строка результатов поискового запроса не отображается');
  return await element(by.id('list-manager')).element(by.tagName('tbody'))
    .all(by.tagName('tr')).getText();
};
