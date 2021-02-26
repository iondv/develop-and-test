const {serverURL, adminUsername, adminPassword, extSystemUsername, extSystemSecret} = require('../../config.js');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const url = require('url');
const base64 = require('base64-js');
// спецификация - https://www.npmjs.com/package/oauth2-server

describe('Checking echo-oauth service', function () {
  let sess = '';
  let dlg = false;
  let auth_code = '';
  let token = '';
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

    if (sess) {
      try {
        res = await request({
          method: 'GET',
          uri: `${serverURL}/oauth2/grant?client_id=${extSystemUsername}&response_type=code`,
          headers: {
            Cookie: sess
          },
          resolveWithFullResponse: true
        });
        dlg = res.statusCode === 200;
      } catch (e) {
        res = e.response;
        console.error(res);
      }

      try {
        res = await request({
          method: 'POST',
          uri: `${serverURL}/oauth2/grant?client_id=${extSystemUsername}&response_type=code&state=123`,
          headers: {
            Cookie: sess
          },
          resolveWithFullResponse: true
        });
      } catch (e) {
        res = e.response;
      }

      if (res.headers['location']) {
        const redirect = url.parse(res.headers['location'], true);
        auth_code = redirect.query.code;
        if (auth_code) {
          try {
            res = await request({
              method: 'POST',
              uri: `${serverURL}/oauth2/token`,
              headers: {
                'Authorization': 'Basic ' + base64.fromByteArray(Buffer.from(extSystemUsername + ':' + extSystemSecret, 'utf8'))
              },
              form: {
                'grant_type': 'authorization_code',
                'code': auth_code
              },
              json: true,
              resolveWithFullResponse: true
            });
            token = res.body.access_token;
          } catch (e) {
            res = e.response;
            console.error(res);
          }
        }
      }
    }
  });
  it('check OAuth2 process', function () {
    expect(sess).toBeTruthy();
    expect(dlg).toBeTruthy();
    expect(auth_code).toBeTruthy();
    expect(token).toBeTruthy();
  });

  describe('Checking auth with valid OAuth2 token', function () {
    let res;
    beforeAll(async function () {
      try {
        res = await request({
          method: 'GET',
          uri: `${serverURL}/rest/echo-oauth`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
      } catch (e) {
        res = e.response;
      }
    });
    it('check the response body', function () {
      expect(typeof res.body).toEqual('object');
      expect(res.body.echo).toEqual('peekaboo');
    });
  });

  describe('Checking auth with invalid OAuth2 token', function () {
    let res;
    beforeAll(async function () {
      try {
        res = await request({
          method: 'GET',
          uri: `${serverURL}/rest/echo-oauth`,
          resolveWithFullResponse: true,
          json: true,
          headers: {
            'Authorization': 'Bearer aaa'
          }
        });
      } catch (e) {
        res = e.response;
      }
    });
    it('statusCode has to be 401', function () {
      expect(res.statusCode).toEqual(401);
    });
  });
});
