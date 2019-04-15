/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 21.12.2017.
 */
/* globals browser*/

/**
 * Количество попыток на успешное выполнение действия.
 * @default
 * @type {number}
 */
const MAX_TICK = 10;
/**
 * Время, которое будет ждать функция перед повторением действия в миллисекундах.
 * @default
 * @type {number}
 */
const TICK_TIME = 1000;
/**
 * Функция, которая вызывает другую функцию по таймер до тех пор, пока она не вернёт true или количество запросов не
 * превысит максимальное
 * @param {Function} iterable - функция которую мы вызваем
 * @param {Number} tickTime - Через сколько времени будет повторено действие
 * @param {Number} maxTick - Максимальное количество повторений
 * @returns {Promise}
 */
module.exports.iterance = function iterance(iterable, tickTime, maxTick) {
  return new Promise((resolve, reject) => {
    maxTick = maxTick || MAX_TICK;
    tickTime = tickTime || TICK_TIME;
    let timerId = 0;
    let overHeat = 0;
    timerId = setTimeout(function tick() {
      if (overHeat > maxTick) {
        clearTimeout(timerId);
        reject('Превышено число попыток!');
      } else {
        iterable()
          .then((funcTionResult) => {
            if (funcTionResult === true) {
              clearTimeout(timerId);
              resolve('Успех!');
            }
          })
          .catch(() => {
            overHeat++;
            timerId = setTimeout(tick, tickTime);
          });
      }
    }, tickTime);
  });
};
/**
 * Функция, которая пытается переключиться на фрейм imodal-frame по таймер до тех пор, пока не получится или пока
 * количество запросов не превысит максимальное
 * @param tickTime - Через сколько времени будет повторён запрос
 * @param maxTick - Максимальное количество запросов
 * @returns {Promise}
 */
module.exports.iteranceSwitchToImodal = function iteranceSwitchToImodal(tickTime, maxTick) {
  return new Promise((resolve, reject) => {
    maxTick = maxTick || MAX_TICK;
    tickTime = tickTime || TICK_TIME;
    let timerId = 0;
    let overHeat = 0;
    timerId = setTimeout(function tick() {
      if (overHeat > maxTick) {
        clearTimeout(timerId);
        reject('Превышено число попыток! Мы не смогли переключитьс на фрейм');
      } else {
        browser.switchTo().frame('imodal-frame')
          .then((funcTionResult) => {
            if (funcTionResult === null) {
              clearTimeout(timerId);
              resolve('Успех!');
            }
          })
          .catch(() => {
            overHeat++;
            timerId = setTimeout(tick, tickTime);
          });
      }
    }, tickTime);
  });
};
