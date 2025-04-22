const { Given, When, Then } = require('@wdio/cucumber-framework');
const assert = require('assert');

Given('I set the device location to Marina Bay Sands', async function() {

    const latitude = 1.2834;
    const longitude = 103.8607;
    const altitude =0;
  
    await browser.execute('mobile: setGeolocation', {
        latitude,
        longitude,
        altitude,
    });

    await browser.execute('mobile: shell', {
      command: 'am',
      args: [
        'broadcast', 
        '-a', 'com.android.settings.location.MODE_CHANGED', 
        '--es', 'provider', 'gps', 
        '--ez', 'enabled', 'true'
      ],
    });
  
    // gps와 network 위치 제공자 활성화
    await browser.execute('mobile: shell', {
      command: 'settings',
      args: [
        'put', 
        'secure', 
        'location_providers_allowed', 
        '+gps'
      ],
    });
  
    await browser.execute('mobile: shell', {
      command: 'settings',
      args: [
        'put', 
        'secure', 
        'location_providers_allowed', 
        '+network'
      ],
    });
  
    // Mock Location 허용
    await browser.execute('mobile: shell', {
      command: 'appops',
      args: [
        'set', 
        'io.appium.android.apis', 
        'android:mock_location', 
        'allow'
      ],
    });
  
    // 실제 위치 설정
    await browser.execute('mobile: shell', {
      command: 'am',
      args: [
        'broadcast',
        '-a', 'android.intent.action.SET_LOCATION',
        '--es', 'lat', latitude.toString(),
        '--es', 'lon', longitude.toString(),
      ],
    });
  });

When('I open Google Maps', async function() {
    // Maps 의 activity가 기기 마다 다를 수 있기 때문에 적어주어야 함.
    //adb shell dumpsys window | grep -E 'mCurrentFocus' 으로 activity 확인 가능
    await browser.startActivity('com.google.android.apps.maps', 'com.google.android.maps.MapsActivity');
    await browser.pause(10000); // 앱이 완전히 로드될 때까지 대기
});

When('I search for {string}', async (destination) => {
    const searchBoxSelector = 'new UiSelector().resourceId("com.google.android.apps.maps:id/search_omnibox_text_box")';
    const searchBox = await $(`android=${searchBoxSelector}`);
    await searchBox.click();

    const inputSelector = 'new UiSelector().resourceId("com.google.android.apps.maps:id/search_omnibox_edit_text")';
    const inputField = await $(`android=${inputSelector}`);
    await inputField.setValue(destination);

    await browser.pressKeyCode(66); // Enter 키 입력
  await browser.pause(5000); // 검색 결과 로드 대기
});

Then('I should see directions to Sentosa', async () => {
    const directionsButtonSelector = 'new UiSelector().descriptionContains("Directions")';
    const directionsButton = await $(`android=${directionsButtonSelector}`);
    await directionsButton.click();
    await browser.pause(5000); // 경로 정보 로드 대기

    const startTextSelector = 'new UiSelector().text("Start")';
    const startElement = await $(`android=${startTextSelector}`);
    const isDisplayed = await startElement.isDisplayed();

    assert.strictEqual(isDisplayed, true, '"Start" 텍스트가 보이지 않습니다');
});
