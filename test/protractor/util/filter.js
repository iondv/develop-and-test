/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 26.01.2018.
 */
/* globals browser, element, by, protractor*/
const assert = require('assert');
const getTablePage = require('./list').getTablePage;

/**
 * Нажать на иконку фильтра и открыть фильтрацию в колонке.
 * @param colomn {Number} [colomn=0] - номер колонки в которой будет открыта фильтрация. По молчанию 0 (первая колонка).
 * @param table {Number} [table=0]- номер таблицы для работы. По молчанию 0.
 */
module.exports.pressFilter = async function pressFilter(colomn, table) {
  table = table || 0;
  colomn = colomn || 0;
  await browser.wait(EC.invisibilityOf(element.all(by.className('table-loading')).get(table)),
    browser.params.waitElementLoad, 'Таблица с элементами не отображается');
  await browser.wait(EC.visibilityOf(element.all(by.className('dataTables_scrollHead')).get(table)
    .all(by.className('dt-head-filter-toggle glyphicon glyphicon-filter')).get(colomn)),
    browser.params.waitElementLoad, 'Иконка фильтрации не появилась');
  await element.all(by.className('table')).get(table)
    .all(by.className('dt-head-filter-toggle glyphicon glyphicon-filter')).get(colomn).click();
};
/**
 * Отфильтровать содержимое в колонке таблицы и вернуть содеримое таблицы.
 * @param value {String} - строка, которая будет передана в поле для фильтрации.
 * @param colomn {Number} [colomn=0] - номер колонки в которой будет открыта фильтрация. По молчанию 0 (первая колонка).
 * @param table {Number} [table=0]- номер таблицы для работы. По молчанию 0.
 * @returns {Array} - массив строк таблицы, каждая строка склеена пробелами.
 */
module.exports.filter = async function (value, colomn, table) {
  assert(typeof value === 'string', 'Для поиска передана не строка');
  colomn = colomn || 0;
  table = table || 0;
  await this.pressFilter(colomn, table);
  await browser.wait(EC.visibilityOf(element.all(by.className('dataTables_scrollHead')).get(table)),
    browser.params.waitElementLoad, 'Заголовок таблицы не отображается');
  await browser.wait(EC.visibilityOf(element.all(by.className('dataTables_scrollHead')).get(table)
    .all(by.className('dt-head-filter-container')).get(colomn)),
    browser.params.waitElementLoad, 'Поле ввода поискового запроса не отображается');
  await element.all(by.className('dataTables_scrollHead')).get(table)
    .all(by.className('dt-head-filter-container')).get(colomn).click();
  await browser.actions()
    .keyDown(protractor.Key.CONTROL)
    .sendKeys(protractor.Key.HOME)
    .keyDown(protractor.Key.SHIFT)
    .sendKeys(protractor.Key.END)
    .keyUp(protractor.Key.CONTROL)
    .keyUp(protractor.Key.SHIFT)
    .sendKeys(value)
    .sendKeys(protractor.Key.RETURN)
    .perform();
  let searchResult = await getTablePage(table);
  assert(typeof searchResult === 'object', 'Ошибка при получении данных таблицы');
  searchResult = await searchResult.filter((item)=> {
    return item.indexOf(value) !== -1
  });
  return searchResult;
};
