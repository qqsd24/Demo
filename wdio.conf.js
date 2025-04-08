const path = require('path');
const fs = require('fs');
const axios = require('axios'); // ✅ axios 추가, Slack 에 사용됨.
const Video = require('wdio-video-reporter').default; // ✅ 동영상 리포터 추가 ✅ default 속성 추가
const reporter = require('multiple-cucumber-html-reporter'); // ✅ multiple-cucumber-html-reporter 추가


module.exports.config = {

	services: ['appium'],

	runner: 'local',
	specs: ['./src/features/**/*.feature'],

	maxInstances: 1,
	capabilities: [{
		"platformName": "Android",
        "appium:deviceName": "Galaxy Wide4",
        "appium:platformVersion": "11.0",
        "appium:automationName": "UiAutomator2",
        "appium:udid": "R59N70036ZL",
        "appium:noReset": "false"
	}],

	logLevel: 'info',
	bail: 0,  
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,

	framework: 'cucumber', // Cucumber 사용

	reporters: [
		'spec',

		['cucumberjs-json', {
			jsonFolder: './reports/cucumber-json', //JSON 디폴트 폴더
			outputDir: './reports/cucumber-json', // 리포트 JSON 파일이 저장될 경로
			reportFile: 'report.json',            // 리포트 파일 이름
			language: 'en',                       // 언어 설정

		}]
	],

	cucumberOpts: {
		require: ['./src/step-definitions/**/*.js'], 				// Step 정의 파일 경로
		backtrace: false, 												// 'backtrace'는 실패한 스텝에서 스택 추적 정보를 얼마나 자세히 보여줄지 설정합니다.
		timeout: 60000,		 											// 단계 실행 시간 제한
	},

	before: async function () {
	
	},
	afterStep: async function (step, scenario, result, context) {
		console.log('AfterStep 에서의 Step:', step);
		console.log('AfterStep 에서의 Scenario:', scenario);
		console.log('AfterStep 에서의 result:', result);
		/**
		  * afterStep: function (step, scenario, result, context) {
		},
		 *
		 * Runs after a Cucumber Scenario.
		 * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
		 * @param {object}                 result           results object containing scenario results `{passed: boolean, error: string, duration: number}`
		 * @param {boolean}                result.passed    true if scenario has passed
		 * @param {string}                 result.error     error stack if scenario failed
		 * @param {number}                 result.duration  duration of scenario in milliseconds
		 * @param {object}                 context          Cucumber World object
		 */

	},

	// cucumber-html 리포트를 after hook에 추가
	after: async function (result, capabilities, specs) {
	
	},


	afterScenario: async function (world, result, context) {

		console.log('현재 시나리오의 상태:', result.passed);
		console.log('실행된 Feature :', world.pickle.uri);
		console.log('실행된 Scenario:', world.pickle.name);
		console.log('컨텍스트 파일:', context);

		// 	/**
		// 	 * 
		// 	 * afterScenario: function (world, result, context) {
		// 	 * },
		// 	 * Runs after a Cucumber Feature.
		// 	 * @param {string}                   uri      path to feature file
		// 	 * @param {GherkinDocument.IFeature} feature  Cucumber feature object
		// 	 */

		// 	/** 
		// 	 * 시나리오 진행할 때 마다 진행될 때 넣는 코드라는 것을 알게됨. 
		// 	 * 시나리오 끝나고 에러가 있다면 사진을 촬영하도록 코드를 작성 
		// 	 * 
		// 	 */
		if (!result.passed) {  // 실패한 테스트가 있을 경우
			const timestamp = new Date().toISOString().replace(/:/g, '-');
			const filename = `./screenshots/${world.pickle.name}_${timestamp}.png`;

			try {
				await browser.saveScreenshot(filename);
				console.log('----------------------------------------');
				console.log(`❌ 테스트 실패! 스크린샷 저장됨: ${filename}`);
				console.log('----------------------------------------');

				// context.attach가 존재하면 Cucumber 리포트에 스크린샷 첨부
				if (context.attach) {
					context.attach(fs.readFileSync(filename), 'image/png');
					console.log('✅ 스크린샷이 Cucumber 리포트에 첨부되었습니다.');
				} else {
					console.warn('⚠️ context.attach가 존재하지 않습니다. 첨부하지 못했습니다.');
				}
			} catch (e) {
				console.error('스크린샷 저장 중 오류 발생:', e);
			}

		}

	},


	// afterTest: async function (test, context, { error }) {
	// 	/**
	// 	 * Feature가 끝나면 동작하는 부분.
	// 	 * 
	// 	 * Cucumber 작성한 후 실행을 했을 때 동작을 하지 않음.
	// 	 * https://webdriver.io/docs/configurationfile/ 사이트에서 확인 했을 때 Mocha, Jasmine에서만 지원한다는 것을 알게됨.
	// 	 * 그래서 코드를 삭제 함.
	// 	 * 
	// 	 * afterTest: function (test, context, { error, result, duration, passed, retries }) {
	// 	 * },
	// 	 * Hook that gets executed after the suite has ended (in Mocha/Jasmine only).
	// 	 * @param {object} suite suite details

	// 	 */

	// },
	// after: async function (result, capabilities, specs) {
	// 	/** 
	// 	 * After Hook 은 WebDriver Session이 끝나면 동작을 합니다. 
	// 	 * 
	// 	 * after: function (result, capabilities, specs) {
	// 	 * },
	// 	 * Gets executed right after terminating the webdriver session.
	// 	 * @param {object} config wdio configuration object
	// 	 * @param {Array.<Object>} capabilities list of capabilities details
	// 	 * @param {Array.<String>} specs List of spec file paths that ran

	// 	*/
	// 	console.log('✅ after 훅이 실행되었습니다.');
	// 	console.log('✅ after 훅이 있는 result:', result);
	// 	console.log('✅ after 훅에 있는 Context:', capabilities);
	// 	console.log('✅ after 훅에 있는 results 확인:', specs);

	// 	/*
	// 		Feature가 종료 된 후 스크린 샷을 찍고 싶다면, 여기에 추가를 하면 됩니다.
	// 		result 는 실패에 대한 숫자가 노출 됩니다. 모두 성공하면 0, 실패한 갯수만큼 숫자가 늘어납니다.
	// 	if (result > 0) {  // 실패한 테스트가 있을 경우
	// 		console.log('테스트 실패로 스크린샷을 찍습니다.');

	// 		// results에 포함된 경로에서 파일 이름만 추출
	// 		console.log("✅ FeatureFile 추출합니다.");

	// 		// const featureFileName = path.basename(specs, '.feature'); //results 경로가 맞는데, 동작이 안되어서 배열로 변경함.
	// 		const featureFileName = path.basename(specs[0], '.feature');

	// 		console.log(`✅ featureFile Name 확인: ${featureFileName}`);
	// 		const timestamp = new Date().toISOString().replace(/:/g, '-');
	// 		const filename = `./screenshots/${featureFileName}_${timestamp}.png`;


	// 		try {
	// 			await browser.saveScreenshot(filename);
	// 			console.log('----------------------------------------');
	// 			console.log(`❌ 테스트 실패! 스크린샷 저장됨: ${filename}`);
	// 			console.log('----------------------------------------');

	// 			// context에 cucumberReporter가 있을 경우 첨부
	// 			if (context.cucumberReporter) {
	// 				const cucumberReporter = context.cucumberReporter;
	// 				cucumberReporter.attach(fs.readFileSync(filename), 'image/png');
	// 				console.log('✅ 스크린샷이 Cucumber 리포트에 첨부되었습니다.');
	// 			}
	// 		} catch (e) {
	// 			console.error('스크린샷 저장 중 오류 발생:', e);
	// 		}
	// 	}
	// 	*/
	// },
	onComplete: async function (exitCode, config, capabilities, results) {
	}

};
