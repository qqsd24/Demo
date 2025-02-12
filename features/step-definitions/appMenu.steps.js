const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

console.log("✅ appMenu.js is loaded");  // 디버깅용 로그 추가
Given('I launch the app', async function () {
  console.log("✅ Step: I launch the app");
  await browser.execute('mobile: activateApp', {
    appId: 'io.appium.android.apis',
    appPackage: 'io.appium.android.apis',
    appActivity: 'io.appium.android.apis.ApiDemos'
  });
});

When('I click on the {string} button', async function (buttonName) {
  console.log(`✅ Step: I click on the "${buttonName}" button`);
  const button = await browser.$(`~${buttonName}`);
  await button.click();
});

Then('I should see the {string} screen', async function (screenName) {
  console.log(`✅ Step: I should see the "${screenName}" screen`);
  // const screen = await browser.$(`~${screenName}`);
  const screen = await browser.$('//android.view.ViewGroup[@resource-id="android:id/action_bar"]');
  assert(await screen.isDisplayed(), `The ${screenName} screen is not displayed`);
});
