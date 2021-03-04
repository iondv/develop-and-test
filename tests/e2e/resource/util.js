module.exports = {
  goto
}

const config = require('../../config.js');
const authSelectors = require('./auth/selectors.json');
const authUtil = require('./auth/util.js');

async function goto(page, url, user = config.users.admin) {
  await page.goto(url, config.navigationOptions);
  if (/auth$/.test(page.url()))
    await authUtil.logIn(page, user);
  return true;
}
