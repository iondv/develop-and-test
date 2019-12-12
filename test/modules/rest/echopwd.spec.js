const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');

describe('Проверяем сервис echo-pwd', function() {
  describe('# Requesting echo-pwd GET', function() {
    let resRequest;
    it('check if the request can be made using the baseAuth', async function() {
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-pwd`,
        resolveWithFullResponse: true,
        json: true,
        auth: {username: adminUsername, password: adminPassword}
      })
        .catch();
        resRequest = resRequest.body;
    });
    it('ожидаем тип объект у результата запроса', function() {
      assert.strictEqual(typeof resRequest, 'object');
    });
    it('ожидаем значение свойства echo "peekaboo"', function() {
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
    it('check if the request can be made using the headers auth', async function() {
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-pwd`,
        resolveWithFullResponse: true,
        json: true,
        headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
      })
        .catch();
        resRequest = resRequest.body;
    });
    it('ожидаем тип объект у результата запроса', function() {
      assert.strictEqual(typeof resRequest, 'object');
    });
    it('ожидаем значение свойства echo "peekaboo"', function() {
      assert.strictEqual(resRequest.echo, 'peekaboo');
    });
  });
    describe('# check if the response is valid on request with wrong baseAuth credentials', async function() {
      it('make a request', async function() {
        try{
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-pwd`,
            resolveWithFullResponse: true,
            json: true,
            auth: {username: adminUsername, password: adminPassword + '321'}
          })
            .catch();
            resRequest = resRequest.body;
        } catch (e) {
          resRequest = e.response;
        }});
        it('expecting statusCode 401', function() {
          assert.strictEqual(resRequest.statusCode, 401);
        });
        it('the response\'s body should not contain echo "peekaboo"', function() {
          assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
        });
  });
    describe('# check if the response is valid on request with wrong headers auth credentials', async function() {
      it('make a request', async function() {
        try{
      resRequest = await request({
        method: 'GET',
        uri: `${serverURL}/rest/echo-pwd`,
        resolveWithFullResponse: true,
        json: true,
        headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword + '321'}
      })
        .catch();
        resRequest = resRequest.body;
    } catch (e) {
      resRequest = e.response;
    }});
    it('expecting statusCode 401', function() {
      assert.strictEqual(resRequest.statusCode, 401);
    });
    it('the response\'s body should not contain echo "peekaboo"', function() {
      assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
    });
  });
  describe('# requesting without auth', function() {
    it('make a request', async function() {
      try{
        resRequest = await request({
          method: 'GET',
          uri: `${serverURL}/rest/echo-pwd`,
          resolveWithFullResponse: true,
          json: true
        })
          .catch();
          resRequest = resRequest.body;
      } catch (e) {
        resRequest = e.response;
      }});
      it('expecting statusCode 401', function() {
        assert.strictEqual(resRequest.statusCode, 401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function() {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      });
    });
  });