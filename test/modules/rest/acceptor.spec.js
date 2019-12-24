const assert = require('assert');
const request = require('request-promise-native');
const cryptoRandom = require('crypto').randomBytes;
const {serverURL, adminUsername, adminPassword,
  anyUsername, anyPassword, genwsUsername, genwsPassword} = require('./config.js');

const BASE_REQUEST = {
  method: 'POST', resolveWithFullResponse: true, json: true,
  uri: `${serverURL}/rest/acceptor`, headers: {'Content-Type': 'application/json'},
  auth: {username: adminUsername, password: adminPassword}
}

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
]
let giventoken;
let tempId;

describe('Проверяем сервис acceptor', function() {
  describe('# baseAuth authorization with admin rights, getting a string', function() {
    describe('# result of create objects', function() {
      let res;
      it('делаем запрос, статус должен быть 200', async function() {
        res = await requestBody(reqBody);
        assert.strictEqual(res.statusCode, 200);
      });
      it(`the response\'s body has to contain ${reqBody.length} objects`, async function() {
        assert.strictEqual(res.body.length, reqBody.length);
      });
      it('the response\'s body has to contain fields of requested objects', async function() {
        assert.strictEqual(res.body[0].string_text, reqBody[0].string_text, '#0');
        assert.strictEqual(res.body[1].string_text, reqBody[1].string_text, '#1');
        assert.strictEqual(res.body[2].string_text, reqBody[2].string_text, '#2');
        assert.strictEqual(res.body[3].string_text, reqBody[3].string_text, '#3'); // TODO Нет атрибутов в возвращаемом объекте - только id и _id:  { id: '1f1ca1d7', _id: '1f1ca1d7' }
      });
      it('the response\'s objects has id, also first object requested without id or _id', async function() {
        assert.ok(res.body[0].id);
        tempId = res.body[0].id;
        assert.ok(res.body[1].id);
        assert.ok(res.body[2].id);
        assert.ok(res.body[2].id);
      });
      it('the response\'s second object has id equal to request id', async function() {
        assert.strictEqual(res.body[1].id, reqBody[1].id);
        assert.strictEqual(res.body[1]._id, reqBody[1].id);
      });
      it('the response\'s third object has id equal to request _id', async function() {
        assert.strictEqual(res.body[2].id, reqBody[2]._id);
        assert.strictEqual(res.body[2]._id, reqBody[2]._id);
      });
      it('the request\'s fourth object has not equal "id" and "_id", but response both equal _id', async function() {
        assert.strictEqual(res.body[3].id, reqBody[3].id);
        assert.strictEqual(res.body[3]._id, reqBody[3].id);
      });
    });
    describe('# check created objects', function() {
      before(async function() {
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
          //console.log(res);
          assert.strictEqual(res.statusCode,200);
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
          assert.strictEqual(res.body.id,reqId);
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
          assert.strictEqual(res.body.string_text,item.string_text);
          assert.strictEqual(res.body.string_multilinetext,item.string_multilinetext);
          assert.strictEqual(res.body.string_formattext,item.string_formattext);
          // TODO get crud
        });
      });
    });
  });
  describe('# no authorization', function() {
    let reqOptions;
    let res;
    before(function() {
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
      assert.strictEqual(res.statusCode, 401);
    });
    it('the response body should not contain the requested object', async function() {
      assert.notStrictEqual(res.body,
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