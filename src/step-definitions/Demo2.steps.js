const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');



When('I click on the {string} button', async function (buttonText) {
  // TODO: Construct a selector to locate the button by its visible text.
  // For Android, you can use UiSelector with the text property.
  // Example:
  // const selector = `new UiSelector().text("${buttonText}")`;
  // const button = await $(`android=${selector}`);

  // TODO: Wait for the button element to exist and be clickable.
  // Use waitForExist and waitForEnabled to ensure the element is ready for interaction.
  // Example:
  // await button.waitForExist({ timeout: 5000 });
  // await button.waitForEnabled({ timeout: 5000 });

  // TODO: Perform the click action on the button.
  // Example:
  // await button.click();

  // TODO: Log the action for debugging purposes.
  // Example:
  // console.log(`✅ Clicked on the "${buttonText}" button`);
});