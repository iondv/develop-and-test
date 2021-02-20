const assert = require('assert');
const {serverURL, adminUsername, adminPassword, extSystemUsername, extSystemSecret} = require('./config.js');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const url = require('url');
const base64 = require('base64-js');
// спецификация - https://www.npmjs.com/package/oauth2-server

describe('Checking rest-api proxy', function () {
  let sess = '';
  beforeAll(async function () {
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
  it('check if the user is authenticated', function () {
    expect(sess).toBeTruthy();
  });

  let res;
  it('Try requesting proxy API', async function () {
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

  it('Checking the response body', function () {
    expect(typeof res.body).toEqual('object');
    expect(res.body.echo).toEqual('peekaboo');
  });
});
