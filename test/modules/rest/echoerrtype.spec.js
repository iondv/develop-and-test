const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');

let giventoken;
let cookie;

describe('Проверяем сервис echo-errtype', function() {
  before(async function() {
    giventoken = (await request({
      method: 'GET',
      resolveWithFullResponse: true,
      uri: `${serverURL}/rest/token`,
      headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
    })).body;
  });
  describe('# check if the auth can\'t be passed with the incorrect auth type defined in deploy.json', function() {
    let resRequest;
    describe('## with no auth', async function() {
      before(async function() {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-errtype`,
            resolveWithFullResponse: true,
            json: true,
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function() {
        assert.strictEqual(resRequest.statusCode, 401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function() {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      })
    });

    describe('## using baseAuth', async function() {
      before(async function() {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-errtype`,
            resolveWithFullResponse: true,
            json: true,
            auth: {username: adminUsername, password: adminPassword}
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function() {
        assert.strictEqual(resRequest.statusCode, 401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function() {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      })
    });
    describe('## using headers auth', async function () {
      before(async function () {
        try{
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-errtype`,
            resolveWithFullResponse: true,
            json: true,
            headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function () {
        assert.strictEqual(resRequest.statusCode, 401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function () {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      })
    });
    describe('## using token auth', async function () {
      before(async function () {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-errtype`,
            resolveWithFullResponse: true,
            json: true,
            headers: {'auth-token': giventoken}
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function () {
        assert.strictEqual(resRequest.statusCode, 401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function () {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      })
    });

    describe('## using cookie auth', async function () {
      before(async function () {
        let res;
        try {
          res = await request({
            method: 'POST',
            uri: `${serverURL}/auth`,
            auth: {username: adminUsername, password: adminPassword},
            resolveWithFullResponse: true,
            json: true
          });
        } catch (e) {
          res = e.response;
        }
        cookie = res.headers['set-cookie'];
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-errtype`,
            resolveWithFullResponse: true,
            json: true,
            headers: {Cookie: cookie}
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function () {
        assert.strictEqual(resRequest.statusCode, 401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function () {
        assert.notStrictEqual(resRequest.body.echo, 'peekaboo');
      })
    });
  });
});