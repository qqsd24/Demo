exports.config = {
    // Test runner configuration
    runner: 'local',
    specs: [
        './features/**/*.feature' // 테스트할 feature 파일의 경로
    ],
    exclude: [
        // 제외할 파일의 경로 (필요한 경우)
    ],
    maxInstances: 1,
    // capabilities: [{
    //     platformName: 'Android',
    //     'appium:deviceName': 'Galaxy S9',  // 사용할 디바이스 이름
    //     // 'appium:appPackage': 'io.appium.android.apis',
    //     // 'appium:appActivity': 'io.appium.android.apis.ApiDemos',
    //     'appium:automationName': 'UIAutomator2',
    //     'appium:udid': '1c5af9e313037ece',  // 실제 디바이스의 UDID (필요한 경우)
    //     'appium:noReset': false,  // 앱을 실행 후 재설정 방지
    //     'appium:fullContextList': true, // 앱 내 모든 컨텍스트 보기
    // }],
    capabilities: [{
      platformName: 'Android',
      'appium:deviceName': process.env.DEVICE_NAME || 'Galaxy S9',  // 환경 변수 DEVICE_NAME 사용
      'appium:platformVersion': process.env.DEVICE_NAME === 'Galaxy S21' ? '14.0' : '10.0',  // 디바이스에 맞는 버전 설정
      'appium:automationName': 'UiAutomator2',
      'appium:udid': process.env.DEVICE_NAME === 'Galaxy S21' ? 'R3CR90QB4LF' : '1c5af9e313037ece',  // UDID 선택
      'appium:noReset': false
    }],
    
    logLevel: 'info',  // 로깅 레벨 설정
    bail: 0,  // 테스트가 실패하더라도 계속 실행
    waitforTimeout: 10000,  // 각 요소를 기다리는 최대 시간
    connectionRetryTimeout: 90000,  // 연결 실패시 재시도 타임아웃
    connectionRetryCount: 3,
    framework: 'cucumber',  // Cucumber 사용
    reporters: ['spec'],  // 테스트 결과 리포터
    cucumberOpts: {
        require: ['./features/step-definitions/appMenu.steps.js'],  // Step 파일 경로
        backtrace: false,
        format: ['pretty'],
        // <string[]> ("extension:module") require files with the given EXTENSION after requiring MODULE (repeatable)
        requireModule: [],
        // <boolean> invoke formatters without executing steps
        dryRun: false,
        // <boolean> abort the run on first failure
        failFast: false,
        // <string[]> Only execute the scenarios with name matching the expression (repeatable).
        name: [],
        // <boolean> hide step definition snippets for pending steps
        snippets: true,
        // <boolean> hide source uris
        source: true,
        // <boolean> fail if there are any undefined or pending steps
        strict: false,
        // <string> (expression) only execute the features or scenarios with tags matching the expression
        tagExpression: '',
        // <number> timeout for step definitions
        timeout: 60000,
        // <boolean> Enable this config to treat undefined definitions as warnings.
        ignoreUndefinedDefinitions: false
    },
    // Appium 서버가 자동으로 시작되도록 설정
    
    services: [
        ['appium', {
          command: 'appium',
          args: {
            // Appium 서버가 실행되는 URL을 지정합니다.
            // 기본적으로 로컬에서 실행하면 'http://127.0.0.1:4723'을 사용합니다.
            appiumArgs: ['--address', '127.0.0.1', '--port', 4723, '--allow-cors']
          }
        }]
      ]
}
