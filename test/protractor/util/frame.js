/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 26.01.2018.
 */
/* globals browser*/
const switchToImodal = require('./iterance').iteranceSwitchToImodal;

/**
 * Вариант функции перхода по фреймам, который реализован с использованием промисов.
 * @returns {Promise}
 */
function two() {
  return new Promise((resolve, reject)=> {
    browser.switchTo().defaultContent()
      .then(() => {
        if (this.deepness > 0) {
          let arrPr = [];
          for (let i = 0; i < this.deepness; i++) {
            arrPr.push(browser.wait(EC.visibilityOf(element(by.id('imodal-frame'))), browser.params.waitElementLoad,
              'Фрейм не отображается')
              .then(() => {
                return switchToImodal(100, 15);
              })
              .then(() => {
                if (this.testHeaders === true) {
                  console.log((i + 1) + '/' + this.deepness);
                  return browser.wait(EC.visibilityOf(element.all(by.className('imodal-box-title')).get(0)), browser.params.waitElementLoad,
                    'Заголовок фрейма на который мы перешли не отображается')
                    .then(() => {
                      return element.all(by.className('imodal-box-title')).get(0).getText()
                    })
                    .then((header) => {
                      console.log(header);
                    });
                }
              }))
          }
          return Promise.all(arrPr);
        }
      })
      .then(() => {
        resolve();
      });
  })
}
/**
 * Вариант функции перхода по фреймам, который реализован с использованием async/await.
 */
async function one(){
  try {
    await browser.switchTo().defaultContent();
    if (this.deepness > 0) {
      for (let i = 0; i < this.deepness; i++) {
        await browser.wait(EC.visibilityOf(element(by.className('imodal-frame loaded'))),
          browser.params.waitElementLoad, 'Фрейм не отображается');
        await switchToImodal(100, 15);
        await browser.wait(EC.stalenessOf(element(by.className('loading'))),
          browser.params.waitElementLoad, 'Объекты фрейма не прогрузились');
        await browser.wait(EC.invisibilityOf(element(by.className('object-loader'))),
          browser.params.waitElementLoad, 'Загрузчик объектов не скрылся');
        if (this.testHeaders === true) {
          console.log((i+1)+'/'+this.deepness);
          await browser.wait(EC.visibilityOf(element.all(by.className('imodal-box-title')).get(0)),
            browser.params.waitElementLoad, 'Заголовок фрейма на который мы перешли не отображается');
          let header = await element.all(by.className('imodal-box-title')).get(0).getText();
          console.log(header);
        }
      }
    }
  } catch(err) {
    throw err
  }
}
/**
 * Поле, указывающее на текущую функцию, для перехода по фреймам.
 * @type {one}
 */
module.exports.reselectFrame = one;
/**
 * Функция сбрасывает текущий уровень Глубины до нуля. Необходимо использовать, если вы уходите с фрейма на другую
 * страницу не закрыв его с помощью одной из функций утилит. Так же сбрасывается выбор таблицы.
 */
module.exports.leavePageUnclosed = function () {
  this.deepness = 0;
  this.tableNumber = 0;
};
/**
 * Глубина - это количестов переходов на фрейм, которое нужно сделать для того, чтобы в фокусе оказался
 * тот фрейм с которым идёт работа.
 * @alias DEEPNESS
 * @type {number}
 */
module.exports.deepness = 0;
/**
 * Необъодимо ли выводить расширенную информацию. Подробный переход по фреймам: указывается теущий фрейм
 * через дробь глубина, затем заголовок фрейма, на который совершён переход.
 * @example
 * 1/1
 * Класс обратной коллекции для коллекции
 * 1/1
 * Испанская империя
 * @type {boolean}
 */
module.exports.testHeaders = false;
