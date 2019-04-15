/**
 * Created by IVAN KUZNETSOV{piriflegetont@gmail.com} on 26.02.2018.
 */
let assert = require('assert');
let fs = require('fs');
/**
 * Получить скриншот и сохранить его на диске.
 * @param name {String} - имя скриншота.
 * @param folder {String} - Путь по которому будет сохранён скриншот.
 */
module.exports.takeScreenshot = async function takeScreenshot(name, folder) {
  assert(typeof name === 'string', 'Not a string name for screenshot');
  assert(typeof folder === 'string', 'Not a string folder for screenshot');
  browser.takeScreenshot()
    .then(function (png) {
      console.log(folder, name);
      writeScreenShot(png, folder, name);
    });
};
/**
 * Записать файл на диск.
 * @param {Buffer} data - данные.
 * @param {String} filename - имя файла.
 */
function writeScreenShot(data, filename) {
  assert(typeof filename === 'string', 'Not a string name for screenshot');
  var stream = fs.createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}
