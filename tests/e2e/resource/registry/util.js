module.exports = {
  editItemField,
  saveItem,
  saveAndCloseItem,
  getFieldValue,
  isInteractive
}

const config = require('../../../config.js');
const util = require('../util.js');
const selectors = require('./selectors.json');

async function editItemField(page, selector = selectors.itemViewFormField, label, input) {
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
  await page.click(selectors.itemViewSaveButton);
}

async function saveAndCloseItem(page) {
  await page.waitForSelector(selectors.itemViewSaveAndCloseButton, config.elementVisibleOptions);
  await page.click(selectors.itemViewSaveAndCloseButton);
}
