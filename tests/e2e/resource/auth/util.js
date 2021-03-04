module.exports = {
  logIn
}

const config = require('../../../config.js');
const authSelectors = require('./selectors.json');

async function logIn(page, user = config.users.admin) {
  if (user.login) {
    await page.waitForSelector(authSelectors.login, config.elementVisibleOptions);
    await page.type(authSelectors.login, user.login);
  }
  if (user.password) {
    await page.waitForSelector(authSelectors.password, config.elementVisibleOptions);
    await page.type(authSelectors.password, user.password);
  }
  const response = page.waitForNavigation(config.navigationOptions);
  await page.waitForSelector(authSelectors.submit, config.elementVisibleOptions);
  await page.click(authSelectors.submit);
  return await response;
}
