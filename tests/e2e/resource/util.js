module.exports = {
  goto,
  isVisible,
  clearInput,
  getText
}

const config = require('../../config.js');
const authSelectors = require('./auth/selectors.json');
const authUtil = require('./auth/util.js');
const {ElementHandle} = require('puppeteer');

async function goto(page, url, navigationOptions = config.navigationOptions, user = config.users.admin) {
  await page.goto(url, navigationOptions);
  if (/auth$/.test(page.url()))
    await authUtil.logIn(page, navigationOptions, user);
  return true;
}

function isVisible(element, selector = null) {
  if (element instanceof Element) {
    // throw new TypeError('\"element\" must be a DOM Element object (not a handle)')
    const boundingBox = element.getBoundingClientRect();
    return boundingBox && (boundingBox.width > 0) && (boundingBox.height > 0);
  } else if (selector) {
    return element.$eval(selector, (el, visible) => visible(el), isVisible);
  } else if (element instanceof ElementHandle) {
    return element.boundingBox()
      .then(boundingBox =>
        boundingBox && (boundingBox.width > 0) && (boundingBox.height > 0)
      );
  }
  return null;
}

async function clearInput(element) {
  await element.click({clickCount: 3});
  await element.keyboard.press('Backspace');
}

async function getText(element, selector = null) {
  if (selector)
    return element.$eval(selector, el => el.innerText.trim());
  else
    return element.evaluate(el => el.innerText.trim());
}
