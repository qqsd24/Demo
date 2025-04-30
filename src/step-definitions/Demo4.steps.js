const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

/**
 * PlayStore : startActivity('com.android.vending', 'com.android.vending.AssetBrowserActivity');
 */

Given ('{string}, {string} starts the Google Play app', async function (deviceA, deviceB) {
    console.log(`Starting Google app on ${deviceA} and ${deviceB}`);

    await browser.deviceA.startActivity('com.android.vending', 'com.android.vending.AssetBrowserActivity');
    await browser.deviceB.startActivity('com.android.vending', 'com.android.vending.AssetBrowserActivity');
});

When('Tap on userName on {string}', async function (device) {
    console.log(`Tapping userName on ${device}`);
    const userNamePath = '//android.widget.ImageView[@resource-id="com.android.vending:id/0_resource_name_obfuscated"]'
    
    const userNameButton = await browser[device].$(userNamePath);
    await userNameButton.click();
    await browser[device].pause(2000);
});

When ('Tap the Expand button on {string} then tap Add another account', async function (device) {

    console.log(`Tapping Expand button and Add another account on ${device}`);

    const expandPath = '//android.widget.ImageView[@resource-id="com.android.vending:id/0_resource_name_obfuscated" and @content-desc="Expand account list."]'
    const addAnotherAccountPath = '//android.widget.TextView[@resource-id="com.android.vending:id/0_resource_name_obfuscated" and @text="Add another account"]'

    const expandButton = await browser[device].$(expandPath);
    await expandButton.click();

    const addAnotherAccountButton = await browser[device].$(addAnotherAccountPath);
    await addAnotherAccountButton.click();
    await browser[device].pause(2000);

});

When ('Enter {string} in the Email field on {string} then tap Next', async function (email, device) {
    console.log(`Entering ${email} in the Email field on ${device}`);
    let emailPath = '';

    if (device === 'deviceA') {
        emailPath = '//android.view.View[@resource-id="yDmH0d"]/android.view.View[3]/android.view.View/android.view.View[1]/android.widget.TextView[2]'
    }else if (device === 'deviceB') {
        emailPath = '//android.view.View[@resource-id="yDmH0d"]/android.view.View[2]/android.view.View/android.view.View[1]/android.widget.TextView[2]'
    }
    const nextPath = '//android.widget.Button[@text="Next"]'
    
    const emailField = await browser[device].$(emailPath);
    await emailField.click();
    await browser[device].pause(2000); // Wait for the email field to be clickable
    // await emailField.setValue(email);
    await browser[device].keys(email);
    
    const nextButton = await browser[device].$(nextPath);
    await nextButton.click();
    await browser[device].pause(2000);  
});

When ('Enter {string} in the passowrd field on {string} then tap Next', async function (password, device) {
    console.log(`Entering ${password} in the Email field on ${device}`);
    
    const passwordPath = '//android.widget.EditText'
    const nextPath = '//android.widget.Button[@text="Next"]'
    
    const passwordField = await browser[device].$(passwordPath);

    await passwordField.setValue(password);
    
    const nextButton = await browser[device].$(nextPath);
    await nextButton.click();
    await browser[device].pause(2000);  
});

Then ('Check if the {string} button is displayed on {string}', async function (button, device) {
    console.log(`Checking if ${button} button is displayed on ${device}`);
    
    const agreeButton = `//android.widget.Button[@text="${button}"]`
    
    const agreeElement = await browser[device].$(agreeButton);
    const isPresent = await agreeElement.isExisting(); 
    
    assert.strictEqual(isPresent, true, `${button} button is not displayed on ${device}`);
});