const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
// спецификация - https://www.npmjs.com/package/oauth2-server

describe('Проверяем сервис echo-oauth', function() {
  describe('# Trying to POST', function () {
    let res;
    before(async function () {
      try {
        res = await request({
          method: 'POST',
          uri: `${serverURL}/rest/oauth/grant`,
          auth: {username: adminUsername, password: adminPassword},
          resolveWithFullResponse: true
        });
        console.log(res)
      } catch (e) {
        res = e.response;
        console.error(res)
      }
      console.log(res);
    });
    it('check if /grant is POSTed with auth', function () {
      assert.strictEqual(res.statusCode,200);
    });
  });
});

// GET


    /*describe.skip('# Requesting echo-oauth GET', function () {
      describe('check if the request can be made using the oauth cookie', function () {
        console.log(cookie);
        let resRequest;
        before(async function () {
          try {
            resRequest = await request({
              method: 'GET',
              uri: `${serverURL}/rest/echo-oauth`,
              resolveWithFullResponse: true,
              json: true,
              headers: {cookie: cookie}
            });
          } catch (e) {
            resRequest = e.response;
            //console.log(e);
            console.log(e);
          }
        });
        it.skip('ожидаем отказ в доступе', function () {
          assert.strictEqual(resRequest.statusCode, 403);
        });
        it('ожидаем тип объект у результата запроса', function () {
          assert.strictEqual(typeof resRequest.body, 'object');
        });
        it('ожидаем значение свойства echo "peekaboo"', function () {
          assert.strictEqual(resRequest.body.echo, 'peekaboo');
        });
      });
    });
    describe.skip('# Requesting echo-oauth GET with the modified cookie', function () {
      describe('# check if the request can be made using the oauth cookie with a wrong sid', function () {
        let resRequest;
        cookie[0] = cookie[0].slice(0, 15) + cryptoRandom(5).toString('hex') + cookie[0].slice(25);
        before(async function () {
          try {
            resRequest = await request({
              method: 'GET',
              uri: `${serverURL}/rest/echo-oauth`,
              resolveWithFullResponse: true,
              json: true,
              headers: {Сookie: cookie}
            });
          } catch (e) {
            resRequest = e.response;
          }
        });
        it('statusCode expected to be 403 (Access denied)', function () {
          assert.strictEqual(resRequest.statusCode, 403);
        });
        it('the response should not contain echo "peekaboo"', function () {
          assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
        });
      });
    });
  });
  describe('# Requesting echo-oauth GET without the cookie', function () {
    describe('check if the request can be made without a cookie', function () {
      let resRequest;
      before(async function () {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-oauth`,
            resolveWithFullResponse: true,
            json: true
          });
        } catch (e) {
          resRequest = e.response;
          console.log(e);
        }
      });
      it('statusCode expected to be 403 (Access denied)', function () {
        assert.strictEqual(resRequest.statusCode, 403);
      });
      it('the response should not contain echo "peekaboo"', function () {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      });
    });
  });
});
*/
/*describe('Проверяем сервис echo-oauth', function() {
let cookie = ['ololo'];
describe('# Getting a cookie', function() {
before(async function() {
let res;
try {
  res = await request({
    method: 'POST',
    uri: `${serverURL}/rest/oauth`,
    auth: {username: adminUsername, password: adminPassword},
    resolveWithFullResponse: true
  });
  console.log(res)
} catch (e) {
  res = e.response;
  console.error(res)
}
cookie = res.headers['set-cookie'];
console.log(cookie);
console.log(cookie[0].slice(0,cookie[0].indexOf(';')));
cookie = [cookie[0].slice(0,cookie[0].indexOf(';'))];
console.log(cookie);
proccess.exit(1)
});
it('check if the cookie can be retrieved', function() {
assert.ok(cookie);
});
describe('# Requesting echo-oauth GET', function () {
describe('check if the request can be made using the oauth cookie', function () {
  console.log(cookie);
  let resRequest;
  before(async function () {
    try {
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-oauth`,
        resolveWithFullResponse: true,
        json: true,
        headers: {cookie: cookie}
      });
    } catch (e) {
      resRequest = e.response;
      //console.log(e);
      console.log(e);
    }
  });
  it('ожидаем отказ в доступе', function () {
    assert.strictEqual(resRequest.statusCode, 403);
  });

  /*

   TODO: Не очень понятно почему вы тут ожидаете ответ, если не выполняете аутентификацию по OAuth в первом запросе
   TODO: И вообще при чем тут куки? :)

   it('ожидаем тип объект у результата запроса', function() {
   assert.strictEqual(typeof resRequest.body, 'object');
   });
   it('ожидаем значение свойства echo "peekaboo"', function() {
   assert.strictEqual(resRequest.body.echo, 'peekaboo');
   });
   */
      /*});
    });
    describe('# Requesting echo-oauth GET with the modified cookie', function () {
      describe('# check if the request can be made using the oauth cookie with a wrong sid', function () {
        let resRequest;
        cookie[0] = cookie[0].slice(0, 15) + cryptoRandom(5).toString('hex') + cookie[0].slice(25);
        before(async function () {
          try {
            resRequest = await request({
              method: 'GET',
              uri: `${serverURL}/rest/echo-oauth`,
              resolveWithFullResponse: true,
              json: true,
              headers: {Сookie: cookie}
            });
          } catch (e) {
            resRequest = e.response;
          }
        });
        it('statusCode expected to be 403 (Access denied)', function () {
          assert.strictEqual(resRequest.statusCode, 403);
        });
        it('the response should not contain echo "peekaboo"', function () {
          assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
        });
      });
    });
  });
  describe('# Requesting echo-oauth GET without the cookie', function() {
    describe('check if the request can be made without a cookie', function () {
      let resRequest;
      before(async function () {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-oauth`,
            resolveWithFullResponse: true,
            json: true
          });
        } catch (e) {
          resRequest = e.response;
          console.log(e);
        }
      });
      it('statusCode expected to be 403 (Access denied)', function () {
        assert.strictEqual(resRequest.statusCode, 403);
      });
      it('the response should not contain echo "peekaboo"', function () {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      });
    });
  });
});*/