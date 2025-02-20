const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

console.log("✅ appMenu.js is loaded");  // 디버깅용 로그 추가
Given('I launch the app', async function () {
  console.log("✅ Step: I launch the app");
});

When('I click on the {string} button', async function (buttonName) {
  console.log(`✅ Step: I click on the "${buttonName}" button`);
});

Then('I should see the {string} screen', async function (screenName) {
  console.log(`✅ Step: I should see the "${screenName}" screen`);

});
