const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const {serverURL, adminUsername, adminPassword,
  anyUsername, anyPassword, genwsUsername, genwsPassword} = require('./config.js');

const BASE_REQUEST = {
  method: 'POST', resolveWithFullResponse: true, json: true,
  uri: `${serverURL}/rest/acceptor`, headers: {'Content-Type': 'application/json'},
  auth: {username: adminUsername, password: adminPassword}
};

const reqBody = [
  { // key field "id" or "_id" not defined
    _class: `class_string@develop-and-test`,
    string_text: cryptoRandom(8).toString('hex'),
    string_miltilinetext: "Example10",
    string_formattext: "Example10"
  },
  { // id is defined, but "_id" is undefined
    id: cryptoRandom(32).toString('hex'),
    _class: `class_string@develop-and-test`,
    string_text: cryptoRandom(8).toString('hex'),
    string_miltilinetext: "Example11",
    string_formattext: "Example11"
  },
  {
    _id: cryptoRandom(32).toString('hex'),
    _class: `class_string@develop-and-test`,
    string_text: cryptoRandom(8).toString('hex'),
    string_miltilinetext: "Example12",
    string_formattext: "Example12"
  },
  {
    _id: cryptoRandom(4).toString('hex'),
    id: cryptoRandom(4).toString('hex'),
    _class: `class_string@develop-and-test`,
    string_text: cryptoRandom(8).toString('hex'),
    string_miltilinetext: "Example13",
    string_formattext: "Example13"
  }
];
let giventoken;
let tempId;

describe('Checking acceptor service', function() {
  describe('# basicAuth authorization with admin rights, POSTing strings', function() {
    describe('# result of creation of objects', function() {
      let res;
      it('making the request, statusCode has to be 200', async function() {
        res = await requestBody(reqBody);
        expect(res.statusCode).toEqual(200);
      });
      it(`the response\'s body has to contain ${reqBody.length} objects`, async function() {
        expect(res.body.length).toEqual(reqBody.length);
      });
      it('the response\'s body has to contain fields of requested objects', async function() {
        expect(res.body[0].string_text).toEqual(reqBody[0].string_text);
        expect(res.body[1].string_text).toEqual(reqBody[1].string_text);
        expect(res.body[2].string_text).toEqual(reqBody[2].string_text);
        expect(res.body[3].string_text).toEqual(reqBody[3].string_text); // TODO Нет атрибутов в возвращаемом объекте - только id и _id:  { id: '1f1ca1d7', _id: '1f1ca1d7' }
      });
      it('the response\'s objects has id, also first object requested without id or _id', async function() {
        expect(res.body[0].id).toBeTruthy();
        tempId = res.body[0].id;
        expect(res.body[1].id).toBeTruthy();
        expect(res.body[2].id).toBeTruthy();
      });
      it('the response\'s second object has id equal to request id', async function() {
        expect(res.body[1].id).toEqual(reqBody[1].id);
        expect(res.body[1]._id).toEqual(reqBody[1].id);
      });
      it('the response\'s third object has id equal to request _id', async function() {
        expect(res.body[2].id).toEqual(reqBody[2]._id);
        expect(res.body[2]._id).toEqual(reqBody[2]._id);
      });
      it('the request\'s fourth object has not equal "id" and "_id", but response both equal _id', async function() {
        expect(res.body[3].id).toEqual(reqBody[3].id);
        expect(res.body[3]._id).toEqual(reqBody[3].id);
      });
    });
    describe('# check created objects', function() {
      beforeAll(async function() {
        giventoken = (await request({method: 'GET', resolveWithFullResponse: true,
        uri: `${serverURL}/rest/token`,
        headers: {'auth-user': adminUsername, 'auth-pwd': adminPassword}
        })).body;
        BASE_REQUEST.headers['auth-token'] = giventoken;
      });
      reqBody.forEach((item, i) => {
        let res;
        let reqId;
        it(`get ${i+1}'th`, async function() {
          reqId = item.id === undefined ?
          item._id === undefined ?
            tempId : item._id
             : item.id;
          res = await request({
            method: 'GET',
            resolveWithFullResponse: true,
            uri: `${serverURL}/rest/crud/class_string@develop-and-test/${reqId}`,
            headers: {
              'auth-token': giventoken
            }
          });
          expect(res.statusCode).toEqual(200);
// TODO get crud + status
        });
        it(`check id of ${i+1}'th`, async function() {
          res = await request({
            method: 'GET',
            resolveWithFullResponse: true,
            uri: `${serverURL}/rest/crud/class_string@develop-and-test/${reqId}`,
            headers: {
              'auth-token': giventoken
            },
            json: true
          });
          expect(res.body.id).toEqual(reqId);
          // TODO get crud
        });
        it(`check attr of ${i+1}'th`, async function() {
          res = await request({
            method: 'GET',
            resolveWithFullResponse: true,
            uri: `${serverURL}/rest/crud/class_string@develop-and-test/${reqId}`,
            headers: {
              'auth-token': giventoken
            },
            json: true
          });
          expect(res.body.string_text).toEqual(item.string_text);
          expect(res.body.string_multilinetext).toEqual(item.string_multilinetext);
          expect(res.body.string_formattext).toEqual(item.string_formattext);
          // TODO get crud
        });
      });
    });
    describe('# POSTing objects, request is not JSON', function() {
      let res;
      let text;
      it('making the request, statusCode has to be 400', async function() {
        try {
          res = await request({
            method: 'POST', resolveWithFullResponse: true, json: false,
            uri: `${serverURL}/rest/acceptor`, headers: {'Content-Type': 'text/plain'},
            auth: {username: adminUsername, password: adminPassword},
            body: text = cryptoRandom(8).toString('hex')
          });
        } catch (e) {
          res = e.response;
        }
        expect(res.statusCode).toEqual(400);
      });
      it(`check if the object was not created`, async function() {
        res = await request({
          method: 'GET',
          resolveWithFullResponse: true,
          uri: `${serverURL}/rest/crud/class_string@develop-and-test/?${text}`,
          headers: {
            'auth-token': giventoken
          },
          json: true
        });
        expect(res.body).not.toEqual(text);
      });
    });
  });
  describe('# invalid authorization', function() {
    let reqOptions;
    let res;
    beforeAll(function() {
      reqOptions = {method: 'POST', headers: {
          'auth-token': '123',
          'Content-Type': 'application/json'},
        resolveWithFullResponse: true,
        url: `${serverURL}/rest/acceptor`,
        _id: `10101010-5583-11e6-aef7-cf50314f026b`,
        _class: `class_string@develop-and-test`,
        _classVer: null,
        string_text: "Example10",
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      };
    });
    it('the response statusCode should be 403 (Forbidden)', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      expect(res.statusCode).toEqual(401);
    });
    it('the response body should not contain the requested object', async function() {
      expect(res.body).not.toEqual(
        [{"id":"10101010-5583-11e6-aef7-cf50314f026b","_class":"class_string@develop-and-test","_classVer":"","string_formattext":"Example10","string_miltilinetext":"Example10","string_text":"Example10","_id":"10101010-5583-11e6-aef7-cf50314f026b"}]);
    });
  });
  describe('# no authorization', function() {
    let reqOptions;
    let res;
    beforeAll(function() {
      reqOptions = {method: 'POST', headers: {
        'Content-Type': 'application/json'},
        resolveWithFullResponse: true,
        url: `${serverURL}/rest/acceptor`,
        _id: `10101010-5583-11e6-aef7-cf50314f026b`,
        _class: `class_string@develop-and-test`,
        _classVer: null,
        string_text: "Example10",
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      };
    });
    it('the response statusCode should be 401 (Unauthorized)', async function() {
      try {
        res = await request(reqOptions)
          .then(resp => {return resp})
          .catch();
      } catch (e) {
        res = e.response;
      }
      expect(res.statusCode).toEqual(401);
    });
    it('the response body should not contain the requested object', async function() {
      expect(res.body).not.toEqual(
        [{"id":"10101010-5583-11e6-aef7-cf50314f026b","_class":"class_string@develop-and-test","_classVer":"","string_formattext":"Example10","string_miltilinetext":"Example10","string_text":"Example10","_id":"10101010-5583-11e6-aef7-cf50314f026b"}]);
    });
  });
});

// [
//   {
//       "_class": "type@demo-app",
//       "name": "RAM"
//   },
//   {
//       "_class": "type@demo-app",
//       "name": "SSD"
//   },
//   {
//       "_class": "type@demo-app",
//       "name": "HDD"
//   },
//   {
//       "_class": "type@demo-app",
//       "name": "OS"
//   }
// ]

async function requestBody(reqBody) {
  return request(Object.assign(BASE_REQUEST, {body: reqBody}));
}

// запрос plaintext или другого класса