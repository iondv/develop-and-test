const assert = require('assert');
const {serverURL, adminUsername, adminPassword, extSystemUsername, extSystemSecret} = require('./config.js');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const url = require('url');
const base64 = require('base64-js');
// спецификация - https://www.npmjs.com/package/oauth2-server

describe('Проверяем прокси для rest-api', async function () {
  let sess = '';
  before(async function () {
    let res;
    try {
      res = await request({
        method: 'POST',
        uri: `${serverURL}/auth`,
        form: {username: adminUsername, password: adminPassword}
      });
    } catch (e) {
      res = e.response;
    }

    sess = res.headers['set-cookie'][0];
  });
  it('check if user authenticated', function () {
    assert.ok(sess);

    describe('Проверяем обращение к proxy API', async function () {
      let res;
      before(async function () {
        try {
          res = await request({
            method: 'GET',
            uri: `${serverURL}/registry-ajax-api/rest/echo-token`,
            resolveWithFullResponse: true,
            json: true,
            headers: {
              Cookie: sess
            }
          });
        } catch (e) {
          res = e.response;
        }
      });
      it('проверка содержимого ответа', function () {
        console.log(res.body);
        assert.strictEqual(typeof res.body, 'object', 'тип содержимого - обьект');
        assert.strictEqual(res.body.echo, 'peekaboo', 'атрибут echo равен peekaboo');
      });
    });
  });
});
