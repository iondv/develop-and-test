 module.exports.serverURL = process.env.ION_TEST_URL ?
  process.env.ION_TEST_URL.indexOf('http://') === -1 ?
      `http://${process.env.ION_TEST_URL}` :
     process.env.ION_TEST_URL :
  'http://localhost:8888';

module.exports.adminUsername = process.env.ION_TEST_USER ? process.env.ION_TEST_USER : 'demo@local';
module.exports.adminPassword = process.env.ION_TEST_PASSWORD ? process.env.ION_TEST_PASSWORD : 'ion-demo';

module.exports.anyUsername = process.env.ION_TEST_ANYUSER ? process.env.ION_TEST_ANYUSER : 'anyuser@local';
module.exports.anyPassword = process.env.ION_TEST_ANYPASSWORD ? process.env.ION_TEST_ANYPASSWORD : '123';

module.exports.genwsUsername = process.env.ION_TEST_GENWSUSER ? process.env.ION_TEST_GENWSUSER : 'anyuserwsgen@local';
module.exports.genwsPassword = process.env.ION_TEST_GENWSPASSWORD ? process.env.ION_TEST_GENWSPASSWORD : 'genws';