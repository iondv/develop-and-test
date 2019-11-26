/**
 * Created by YouTHFooL on 14.10.2016.
 */
// Тест проверки обработки поля меты представления "required"
'use strict';

let RequiredPage = require('./required-fields-page-object.js');
let requiredPage = new RequiredPage();

describe.skip('Проверка обработки поля меты представления "required"', function () {
  describe('Шаг 1. Проверка наличия ошибки при сохранении объекта с незаполненными полями', function () {
    it('Открытие списка объектов', function () {
      requiredPage.objectListOpen();
    });
    it('Нажатие кнопки "Создать"', function () {
      requiredPage.createButtonClick();
    });
    it('Нажатие кнопки сохранения', function () {
      requiredPage.saveButtonClick();
    });
    it('Проверка наличия сообщений об ошибке', function () {
      requiredPage.checkErrorMessageShown(['string','real','datatime']);
    });
  });
  describe('Шаг 2. Проверка заполнения обязательных полей и сохранения объекта', function () {
    it('Заполнение поля типа Строка', function () {
      requiredPage.stringAttrFill();
    });
    it('Нажатие кнопки сохранения и закрытия', function () {
      requiredPage.saveAndCloseButtonClick();
    });
    it('Проверка наличия ошибок у всех полей, кроме поля типа Строка', function () {
      requiredPage.checkErrorMessageShown(['real','datatime']);
    });
    it('Заполнение поля типа Действительное', function () {
      requiredPage.realAttrFill();
    });
    it('Нажатие кнопки сохранения', function () {
      requiredPage.saveButtonClick();
    });
    it('Проверка наличия ошибки у поля типа Дата-время и отсутствия ошибок у остальных полей', function () {
      requiredPage.checkErrorMessageShown(['datatime']);
    });
    it('Заполнение поля типа Даты-время', function () {
      requiredPage.dateTimeAttrFill();
    });
    it('Нажатие кнопки сохранения', function () {
      requiredPage.saveButtonClick();
    });
    it('Проверка отсутствия ошибок при сохранении и заплненности поля идентификатора', function () {
      requiredPage.checkErrorMessageHide();
    });
    it('Закрытие фрейма создания объекта', function () {
      requiredPage.closeButtonClick();
    });
  });
  describe('Шаг 3. Удаление созданного объекта', function () {
    it('Выделение созданного объекта', function () {
      requiredPage.selectCreatedObject();
    });
    it('Нажатие кнопки "Удалить"', function () {
      requiredPage.deleteButtonClick();
    });
    it.skip('Проверка отсутствия в списке объекта, созданного в процессе тестирования', function () {
      requiredPage.checkObjectNotInList();
    });
  });
});
