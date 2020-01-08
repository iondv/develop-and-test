module.exports.serverURL = process.env.ION_TEST_URL ?
  process.env.ION_TEST_URL.indexOf('http://') === -1 ?
      `http://${process.env.ION_TEST_URL}` :
     process.env.ION_TEST_URL :
  'http://localhost:8888';

module.exports.adminUsername = process.env.ION_TEST_USER ? process.env.ION_TEST_USER : 'demo@local';
module.exports.adminPassword = process.env.ION_TEST_PASSWORD ? process.env.ION_TEST_PASSWORD : 'ion-demo';

module.exports.extSystemUsername = process.env.ION_TEST_EXT_SYSTEM ? process.env.ION_TEST_EXT_SYSTEM : 'ext@system';
module.exports.extSystemSecret = process.env.ION_TEST_EXT_SECRET ? process.env.ION_TEST_EXT_SECRET : 'ion-demo';

module.exports.anyUsername = process.env.ION_TEST_ANYUSER ? process.env.ION_TEST_ANYUSER : 'user@local';
module.exports.anyPassword = process.env.ION_TEST_ANYPASSWORD ? process.env.ION_TEST_ANYPASSWORD : 'ion-demo';

module.exports.genwsUsername = process.env.ION_TEST_GENWSUSER ? process.env.ION_TEST_GENWSUSER : 'operator@local';
module.exports.genwsPassword = process.env.ION_TEST_GENWSPASSWORD ? process.env.ION_TEST_GENWSPASSWORD : 'ion-demo';