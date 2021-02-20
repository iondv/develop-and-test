const {serverURL, adminUsername, adminPassword} = require('./config.js');
const request = require('request-promise-native');

let giventoken;

describe('Checking echo-pwd service', function() {
  describe('# Requesting echo-pwd GET', function() {
    describe('check if the request can be made using the basicAuth', function () {
      let resRequest;
      beforeAll(async function () {
        resRequest = await request({
          method: 'GET',
          uri: `${serverURL}/rest/echo-pwd`,
          resolveWithFullResponse: true,
          json: true,
          auth: {username: adminUsername, password: adminPassword}
        });
      });
      it('expecting an object type in the response', function () {
        expect(typeof resRequest.body).toEqual('object');
      });
      it('expecting field "echo" containing "peekaboo"', function () {
        expect(resRequest.body.echo).toEqual('peekaboo');
      });
    });

    describe('check if the request can be made using the headers auth', function () {
      let resRequest;
      beforeAll(async function () {
        resRequest = await request({
          method: 'GET',
          uri: `${serverURL}/rest/echo-pwd`,
          resolveWithFullResponse: true,
          json: true,
          headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
        });
      });
      it('expecting an object type in the response', function () {
        expect(typeof resRequest.body).toEqual('object');
      });
      it('expecting field "echo" containing "peekaboo"', function () {
        expect(resRequest.body.echo).toEqual('peekaboo');
      });
    });
  });
  describe('# check if the response is valid on request with wrong basicAuth credentials', function () {
    describe('make a request', function () {
      let resRequest;
      beforeAll(async function () {
        try{
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-pwd`,
            resolveWithFullResponse: true,
            json: true,
            auth: {username: adminUsername, password: adminPassword + '321'}
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function () {
        expect(resRequest.statusCode).toEqual(401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function () {
        expect(resRequest.body.echo).not.toEqual('peekaboo');
      });
    });
  });

  describe('# check if the response is valid on request with wrong headers auth credentials', function () {
    describe('make a request', function () {
      let resRequest;
      beforeAll(async function () {
        try{
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-pwd`,
            resolveWithFullResponse: true,
            json: true,
            headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword + '321'}
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function () {
        expect(resRequest.statusCode).toEqual(401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function () {
        expect(resRequest.body.echo).not.toEqual('peekaboo');
      });
    });
  });

  describe('# requesting without auth', function() {
    describe('make a request', function () {
      let resRequest;
      beforeAll(async function () {
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-pwd`,
            resolveWithFullResponse: true,
            json: true
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function() {
        expect(resRequest.statusCode).toEqual(401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function() {
        expect(resRequest.body.echo).not.toEqual('peekaboo');
      });
    });
  });
  describe('# requesting with a token', function() {
    describe('make a request', function () {
      let resRequest;
      beforeAll(async function () {
        let res;
        try {
          res = await request({
            method: 'GET',
            uri: `${serverURL}/rest/token`,
            resolveWithFullResponse: true,
            headers: {
              'auth-user': adminUsername, 'auth-pwd': adminPassword
            },
            json: true
          });
        } catch (e) {
          res = e.response
        }
        giventoken = res.body;
        try {
          resRequest = await request({
            method: 'GET',
            uri: `${serverURL}/rest/echo-pwd`,
            headers: {'auth-token': giventoken},
            resolveWithFullResponse: true,
            json: true
          });
        } catch (e) {
          resRequest = e.response;
        }
      });
      it('expecting statusCode 401', function() {
        expect(resRequest.statusCode).toEqual(401);
      });
      it('the response\'s body should not contain echo "peekaboo"', function() {
        expect(resRequest.body.echo).not.toEqual('peekaboo');
      });
    });
  });
});