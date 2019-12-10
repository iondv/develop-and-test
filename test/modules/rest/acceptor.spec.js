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
describe('Проверяем сервис acceptor', function() {
  describe('# baseAuth authorization with admin rights, getting a string', function() {
    let res;
    const reqBody = [
      { // key field "id" or "_id" not defined
        _class: `class_string@develop-and-test`,
        string_text: cryptoRandom(8).toString('hex'),
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      },
      { // id is defined, but "_id" is defined
        id: cryptoRandom(32).toString('hex'),
        _class: `class_string@develop-and-test`,
        string_text: cryptoRandom(8).toString('hex'),
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      },
      {
        _id: cryptoRandom(32).toString('hex'),
        _class: `class_string@develop-and-test`,
        string_text: cryptoRandom(8).toString('hex'),
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      },
      {
        _id: cryptoRandom(4).toString('hex'),
        id: cryptoRandom(4).toString('hex'),
        _class: `class_string@develop-and-test`,
        string_text: cryptoRandom(8).toString('hex'),
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      }
    ]
    it('делаем запрос, статус должен быть 200', async function() {
      res = await requestBody(reqBody);
      assert.strictEqual(res.statusCode, 200);
    });
    it(`the response\'s body has to contain ${reqBody.length} objects`, async function() {
      assert.strictEqual(res.body.length, reqBody.length);
    });
    it('the response\'s body has to contain fields of requested objects', async function() {
      assert.strictEqual(res.body[0].string_text, reqBody[0].string_text);
      assert.strictEqual(res.body[1].string_text, reqBody[1].string_text);
      assert.strictEqual(res.body[2].string_text, reqBody[2].string_text);
      assert.strictEqual(res.body[3].string_text, reqBody[3].string_text); // TODO Нет атрибутов в возвращаемом объекте - только id и _id:  { id: '1f1ca1d7', _id: '1f1ca1d7' }
    });
    it('the response\'s objects has id, also first object requested without id or _id', async function() {
      assert.ok(res.body[0].id);
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
      assert.strictEqual(res.body[3].id, reqBody[3]._id);
      assert.strictEqual(res.body[3]._id, reqBody[3]._id);
    });
  });
  describe('# baseAuth authorization with admin rights, getting a text object', function() {
    let res;
    const reqBody = [
      { // key field "id" or "_id" not defined
        _class: `class_text@develop-and-test`,
        text_text: cryptoRandom(8).toString('hex'),
        text_miltilinetext: "Example10",
        text_formattext: "Example10"
      },
      { // id is defined, but "_id" is defined
        id: cryptoRandom(32).toString('hex'),
        _class: `class_text@develop-and-test`,
        text_text: cryptoRandom(8).toString('hex'),
        text_miltilinetext: "Example10",
        text_formattext: "Example10"
      },
      {
        _id: cryptoRandom(32).toString('hex'),
        _class: `class_text@develop-and-test`,
        text_text: cryptoRandom(8).toString('hex'),
        text_miltilinetext: "Example10",
        text_formattext: "Example10"
      },
      {
        _id: cryptoRandom(4).toString('hex'),
        id: cryptoRandom(4).toString('hex'),
        _class: `class_text@develop-and-test`,
        string_text: cryptoRandom(8).toString('hex'),
        string_miltilinetext: "Example10",
        string_formattext: "Example10"
      }
    ]
    it('делаем запрос, статус должен быть 200', async function() {
      res = await requestBody(reqBody);
      assert.strictEqual(res.statusCode, 200);
    });
    it(`the response\'s body has to contain ${reqBody.length} objects`, async function() {
      assert.strictEqual(res.body.length, reqBody.length);
    });
    it('the response\'s body has to contain fields of requested objects', async function() {
      assert.strictEqual(res.body[0].text_text, reqBody[0].text_text);
      assert.strictEqual(res.body[1].text_text, reqBody[1].text_text);
      assert.strictEqual(res.body[2].text_text, reqBody[2].text_text);
      assert.strictEqual(res.body[3].text_text, reqBody[3].text_text); // (?) TODO Нет атрибутов в возвращаемом объекте - только id и _id:  { id: '1f1ca1d7', _id: '1f1ca1d7' }
    });
    it('the response\'s objects have id\'s, also first object requested without id or _id', async function() {
      assert.ok(res.body[0].id);
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
    it('the request\'s fourth object does not have equal "id" and "_id", but in the response both are equal to _id', async function() {
      assert.strictEqual(res.body[3].id, reqBody[3]._id);
      assert.strictEqual(res.body[3]._id, reqBody[3]._id);
    });
  });
  describe.skip('# no authorization', function() {
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
  try {
      return request(Object.assign(BASE_REQUEST, {body: reqBody}))
  .then(resp => {return resp}).catch();
  } catch (e) {
      return res = e.response;
  }
}

// запрос plaintext или другого класса