const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

const nameSelector = `//android.widget.EditText[@resource-id="io.appium.android.apis:id/username_edit"]`;
const passwordSelector = `//android.widget.EditText[@resource-id="io.appium.android.apis:id/password_edit"]`;



Given('I launch the app', async function () {
  console.log("✅ Step: I launch the app");
  await browser.startActivity(
    'io.appium.android.apis',
  'io.appium.android.apis.ApiDemos'
  );
});


When('I click on the {string} button', async function (buttonText) {
  // TODO: Construct a selector to locate the button by its visible text.
  // For Android, you can use UiSelector with the text property.
  // Example:
  // const selector = `new UiSelector().text("${buttonText}")`;
  // const button = await $(`android=${selector}`);

  const button =  await $(`~${buttonText}`);

  // TODO: Wait for the button element to exist and be clickable.
  // Use waitForExist and waitForEnabled to ensure the element is ready for interaction.
  // Example:
  await button.waitForExist({ timeout: 5000 });
  // await button.waitForEnabled({ timeout: 5000 });

  // TODO: Perform the click action on the button.
  // Example:
  await button.click();

  // TODO: Log the action for debugging purposes.
  // Example:
  console.log(`✅ Clicked on the "${buttonText}" button`);
});

When ('I enter {string} into the {string} field', async function (text, fieldName) {

  let selector;

  switch (fieldName) {
    case "Name":
      selector = nameSelector;
      break;

    case "Password":
      selector = passwordSelector;
      break;

    default:
      throw new Error(`알 수 없는 필드 이름: ${fieldName}`);
  }

  const field = await $(selector);
  await field.setValue(text);

});
Then('I retrieve the entered Name and Password values and log them', async function() {
  
  const expectedName = 'Automation';
  const expectedPassword = '!234Qwer';

  const nameField = await $(nameSelector);
  const actualName = await nameField.getText();

  // Password 입력창에서 텍스트 가져오기
  const passwordField = await $(passwordSelector);
  const actualPassword = await passwordField.getText();

  // 로그 출력
  console.log(`🟡 Name 실제값 (Actual): ${actualName}`);
  console.log(`🟡 Password 실제값 (Actual): ${actualPassword}`);

  // 비교 (assert)
  assert.strictEqual(actualName, expectedName, 'Name 값이 일치하지 않습니다.');
  assert.strictEqual(actualPassword, expectedPassword, 'Password 값이 일치하지 않습니다.');

  // 앱 종료
  await driver.terminateApp('io.appium.android.apis');
  console.log("✅ App terminated after all scenarios completion.");
});
