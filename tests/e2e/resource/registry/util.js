module.exports = {
  checkField,
  findLabel,
  editField,
  saveItem,
  saveAndCloseItem,
  getFieldValue,
  isInteractive,
  clickControl
}

const config = require('../../../config.js');
const util = require('../util.js');
const selectors = require('./selectors.json');

async function checkField(page, selector = selectors.itemViewFormField, label) {
  const formgroups = await page.$$(selector);
  for (const formgroup of formgroups) {
    const labelText = await formgroup.$eval('label', el => el.innerText.trim());
    if (labelText === label) {
      return true;
    }
  }
  return false;
}

async function findLabel(page, selector = selectors.itemViewFormField, possibleLabels = []) {
  for (const label of possibleLabels)
    if (await checkField(page, selector, label))
      return label;
  return null;
}

async function editField(page, selector = selectors.itemViewFormField, label, input) {
  const formgroups = await page.$$(selector);
  for (const formgroup of formgroups) {
    const labelText = await formgroup.$eval('label', el => el.innerText.trim());
    if (labelText === label) {
      const inputElement = await formgroup.$('input');
      await util.clearInput(inputElement);
      await inputElement.type(input);
      return true;
    }
  }
  return null;
}

async function getFieldValue(page, selector = selectors.itemViewFormField, label) {
  const formgroups = await page.$$(selector);
  for (const formgroup of formgroups) {
    const labelText = await formgroup.$eval('label', el => el.innerText.trim());
    if (labelText === label) {
      return await util.getText(formgroup, selectors.itemViewFormValue);
    }
  }
  return null;
}

async function isInteractive(page, selector = selectors.itemViewFormField, label) {
  const formgroups = await page.$$(selector);
  for (const formgroup of formgroups) {
    const labelText = await formgroup.$eval('label', el => el.innerText.trim());
    if (labelText === label) {
      if (await formgroup.$(selectors.itemViewFormInteractiveField))
        return true;
      else if (await formgroup.$(selectors.itemViewFormStaticField))
        return false;
      else
        return null;
    }
  }
  return null;
}

async function saveItem(page) {
  await page.waitForSelector(selectors.itemViewSaveButton, config.elementVisibleOptions);
  await Promise.all([
    Promise.race([
      page.waitForNavigation(config.navigationOptions),
      page.waitForSelector(selectors.itemViewError, config.elementVisibleOptions)
    ]),
    page.click(selectors.itemViewSaveButton)
  ]);
  const messageEl = await page.$(selectors.itemViewError);
  if(messageEl && (await util.isVisible(messageEl)))
    throw new Error(await util.getText(messageEl));
  return true;
}

async function saveAndCloseItem(page) {
  await page.waitForSelector(selectors.itemViewSaveAndCloseButton, config.elementVisibleOptions);
  await Promise.all([
    Promise.race([
      page.waitForNavigation(config.navigationOptions),
      page.waitForSelector(selectors.itemViewError, config.elementVisibleOptions)
    ]),
    page.click(selectors.itemViewSaveAndCloseButton)
  ]);
  const messageEl = await page.$(selectors.itemViewError);
  if(messageEl && (await util.isVisible(messageEl)))
    throw new Error(await util.getText(messageEl));
  return true;
}

async function findControl(page, selector = selectors.itemViewObjectControl, label) {
  const actions = await page.$$(selector);
  for (const action of actions) {
    const labelText = await util.getText(action);
    if (labelText === label) {
      return action;
    }
  }
  return null;
}

async function clickControl(page, selector = selectors.itemViewObjectControl, label) {

  return null;
}
