const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

console.log("✅ appMenu.js is loaded");  // 디버깅용 로그 추가
Given('I launch the app', async function () {
  console.log("✅ Step: I launch the app");
  await browser.startActivity('io.appium.android.apis','io.appium.android.apis.ApiDemos')

});

When('I click on the App button', async function () {
  const appButton = await $('~App');
  await appButton.click();

});

When('I click on the Alert Dialogs button', async function () {
  const alertButton = await $('~Alert Dialogs');
  await alertButton.click();

});

When('I click on the List Dialog button', async function () {
  const listButton = await $('~List dialog');
  await listButton.click();

});

Then('The correct dialog message should be displayed', async () => {
  const commands = [
    'Command one',
    'Command two',
    'Command three',
    'Command four'
  ];

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i];
    const item = await $(`android=new UiSelector().text("${cmd}")`);
    await item.click();

    // 다이얼로그 메시지 확인
    const messageElem = await $('id=android:id/message');
    const messageText = await messageElem.getText();

    const expectedMessage = `You selected: ${i} , ${cmd}`;
    assert.strictEqual(
      messageText,
      expectedMessage,
      `Expected "${expectedMessage}" but got "${messageText}"`
    );

    // 뒤로가기 버튼 눌러서 다이얼로그 닫기
    await driver.back();

    // 다시 List Dialog 버튼 클릭해서 다음 명령어 테스트
    const listDialogBtn = await $('~List dialog');
    await listDialogBtn.click();
  }
  // 앱 종료
  await browser.terminateApp('io.appium.android.apis');
  console.log("✅ App terminated after all scenarios completion.");
});
