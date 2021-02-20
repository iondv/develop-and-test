const assert = require('assert');
const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');

describe.skip('Checking access rights', function () {
  describe('check if the user has access to only one database', function () {
    let res;
    before(async function () {
      res = await request({
        method: 'GET',
        uri: `${serverURL}/rest/security-test`,
        resolveWithFullResponse: true,
        json: true,
        auth: {username: adminUsername, password: adminPassword}
      });
    });
    it('expecting access to only one database', function () {
      if (res.body.length !== 1) {
        console.error(res.body);
      }
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toEqual(1);
    });
  });
  describe('check if the application database is accessible', function () {
    let res;
    before(async function () {
      const token = (await request({
        method: 'GET',
        uri: `${serverURL}/rest/token`,
        resolveWithFullResponse: true,
        json: true,
        auth: {username: adminUsername, password: adminPassword}
      })).body;
      res = await request({
        method: 'GET',
        uri: `${serverURL}/rest/crud/class_string@develop-and-test`,
        resolveWithFullResponse: true,
        json: true,
        headers: {'auth-token': token}
      });
    });
    it('expecting objects list', function () {
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
  })
});