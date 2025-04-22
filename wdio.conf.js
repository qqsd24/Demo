
const fs = require('fs');

const reporter = require('multiple-cucumber-html-reporter'); // ✅ multiple-cucumber-html-reporter 추가
const cucumberReport = require('wdio-cucumberjs-json-reporter')

const jsonFolderPath = './reports/cucumber-json';
const htmlReportPath = './reports/cucumber-html';
const screenshotsPath = './reports/screenshot';
exports.config = {
    //
    // ============
    // Capabilities
    // ============
    // Define your capabilities here. WebdriverIO can run multiple capabilities at the same
    // time. Depending on the number of capabilities, WebdriverIO launches several test
    // sessions. Within your capabilities you can overwrite the spec and exclude options in
    // order to group specific specs to a specific capability.
    //
    // First, you can define how many instances should be started at the same time. Let's
    // say you have 3 different capabilities (Chrome, Firefox, and Safari) and you have
    // set maxInstances to 1; wdio will spawn 3 processes. Therefore, if you have 10 spec
    // files and you set maxInstances to 10, all spec files will get tested at the same time
    // and 30 processes will get spawned. The property handles how many capabilities
    // from the same test should run tests.
    //
    maxInstances: 10,
    //
    // If you have trouble getting all important capabilities together, check out the
    // Sauce Labs platform configurator - a great tool to configure your capabilities:
    // https://saucelabs.com/platform/platform-configurator
    //
    capabilities: [{
        // capabilities for local Appium web tests on an Android Emulator
        platformName: 'Android',
        'appium:deviceName': 'Galaxy S21',
        'appium:platformVersion': '14.0',
        'appium:automationName': 'UiAutomator2',
        'appium:noReset': false
    }],

    //
    // ===================
    // Test Configurations
    // ===================
    // Define all options that are relevant for the WebdriverIO instance here
    //
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'info',
    //
    // Set specific log levels per logger
    // loggers:
    // - webdriver, webdriverio
    // - @wdio/browserstack-service, @wdio/lighthouse-service, @wdio/sauce-service
    // - @wdio/mocha-framework, @wdio/jasmine-framework
    // - @wdio/local-runner
    // - @wdio/sumologic-reporter
    // - @wdio/cli, @wdio/config, @wdio/utils
    // Level of logging verbosity: trace | debug | info | warn | error | silent
    // logLevels: {
    //     webdriver: 'info',
    //     '@wdio/appium-service': 'info'
    // },
    //
    // If you only want to run your tests until a specific amount of tests have failed use
    // bail (default is 0 - don't bail, run all tests).
    bail: 0,
    //
    // Set a base URL in order to shorten url command calls. If your `url` parameter starts
    // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
    // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
    // gets prepended directly.
    // baseUrl: 'http://localhost:8080',
    //
    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,
    //
    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 120000,
    //
    // Default request retries count
    connectionRetryCount: 3,
    //
    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: [
		['appium', {
			args: {
				allowInsecure: 'adb_shell',
			},
		}]
	],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: https://webdriver.io/docs/frameworks
    //
    // Make sure you have the wdio adapter package for the specific framework installed
    // before running any tests.
    framework: 'cucumber',
    
    //
    // The number of times to retry the entire specfile when it fails as a whole
    // specFileRetries: 1,
    //
    // Delay in seconds between the spec file retry attempts
    // specFileRetriesDelay: 0,
    //
    // Whether or not retried spec files should be retried immediately or deferred to the end of the queue
    // specFileRetriesDeferred: false,
    //
    // Test reporter for stdout.
    // The only one supported by default is 'dot'
    // see also: https://webdriver.io/docs/dot-reporter
    reporters: ['spec',
        ['cucumberjs-json', {
			jsonFolder: jsonFolderPath, 			//JSON 디폴트 폴더
			language: 'en',                       // 언어 설정

		}]
    ],

    specs: [
        './src/features/**/Demo1.feature'
    ],
    // Patterns to exclude.
    exclude: [
        // 'path/to/excluded/files'
    ],
    // If you are using Cucumber you need to specify the location of your step definitions.
    cucumberOpts: {
        // <string[]> (file/dir) require files before executing features
        require: ['./src/step-definitions/**/Demo1.steps.js'],
        // <boolean> show full backtrace for errors
        backtrace: false,
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
    onPrepare: async function() {
        if (!fs.existsSync(screenshotsPath)) {
			fs.mkdirSync(screenshotsPath, { recursive: true });
			console.log("✅ screenshots 폴더가 생성되었습니다.");
		}
    }
,
    afterScenario: async function (world, result, context) {


		/***
		 * Screenshot 기능
		 * parameter로 받은 result의 결과를 확인하여 failed 인 경우에만 사진을 촬영한다.
		 * Cucumber Report에 파라미터를 만들어 넣는다.
		 */
        // screenshots 폴더가 없으면 생성
		
		if (result.passed) {
			const timestamp = new Date().toISOString().replace(/:/g, '-');
			const filename = `${screenshotsPath}/${world.pickle.name}_${timestamp}.png`;

			await browser.saveScreenshot(filename);
			const base64Image = fs.readFileSync(filename).toString('base64');
			cucumberReport.attach(base64Image, 'image/png');
		}
    },
    onComplete: async function () {

		/**
		 * HTML REPORT 생성
		 */
		// 리포트가 생성되었는지 확인하고 생성
		if (fs.existsSync(jsonFolderPath)) {
			reporter.generate({
			
				jsonDir: jsonFolderPath,
				reportPath: htmlReportPath,
				openReportInBrowser: false,
			});
		} else {
			console.error('❌ JSON 리포트 파일을 찾을 수 없습니다.');
		}

	},

}
