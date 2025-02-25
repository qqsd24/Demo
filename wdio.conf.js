const path = require('path');
const fs = require('fs');
const axios = require('axios'); // ✅ axios 추가, Slack 에 사용됨.
const Video = require('wdio-video-reporter').default; // ✅ 동영상 리포터 추가 ✅ default 속성 추가
const reporter = require('multiple-cucumber-html-reporter'); // ✅ multiple-cucumber-html-reporter 추가


module.exports.config = {

	// Appium을 별도로 동작할 경우
	// hostname: 'localhost',
	// port: 4723,
	// services: [],

	//Appium을 npx wdio wdio.conf.js와 함께 실행하려면
	services: ['appium'],

	runner: 'local',
	specs: ['./features/**/appMenu.feature'], // Feature 파일 경로

	maxInstances: 1,
	capabilities: [{
		platformName: 'Android',
		'appium:deviceName': process.env.DEVICE_NAME || 'Galaxy S9', // 환경 변수 DEVICE_NAME 사용
		'appium:platformVersion': process.env.DEVICE_NAME === 'Galaxy S21' ? '14.0' : '10.0', // 디바이스에 맞는 버전 설정
		'appium:automationName': 'UiAutomator2',
		'appium:udid': process.env.DEVICE_NAME === 'Galaxy S21' ? 'R3CR90QB4LF' : '1c5af9e313037ece', // UDID 선택
		'appium:noReset': false
		// "platformName": "Android",
        // "appium:deviceName": "Galaxy S21",
        // "appium:platformVersion": "14.0",
        // "appium:automationName": "UiAutomator2",
        // "appium:udid": "R3CR90QB4LF",
        // "appium:noReset": "false"
	}],

	logLevel: 'info', //Detail한 값을 보고 싶다면 'debug' 설정하면 됨.
	bail: 0,  // 모든 테스트가 끝날 때까지 실행되도록 설정
	waitforTimeout: 10000,
	connectionRetryTimeout: 90000,
	connectionRetryCount: 3,

	framework: 'cucumber', // Cucumber 사용

	reporters: [
		'spec',
		[Video, {
			saveAllVideos: false, // If true, also saves videos for successful test cases
			videoSlowdownMultiplier: 3, // 녹화 속도 (높을수록 부드러움)
			outputDir: './videoReports', // 비디오 저장 위치
		}],
		['cucumberjs-json', {
			jsonFolder: './reports/cucumber-json', //JSON 디폴트 폴더
			outputDir: './reports/cucumber-json', // 리포트 JSON 파일이 저장될 경로
			reportFile: 'report.json',            // 리포트 파일 이름
			language: 'en',                       // 언어 설정

		}]
	],

	cucumberOpts: {
		require: ['./features/step-definitions/**/login.js'], 				// Step 정의 파일 경로
		tags: [process.env.CUCUMBER_TAGS || '@NonService'], 			// 기본값: @NonService
		backtrace: false, 												// 'backtrace'는 실패한 스텝에서 스택 추적 정보를 얼마나 자세히 보여줄지 설정합니다.
		format: ['json:./reports/cucumber-json/report.json'],			// 'format'은 리포트 형식을 지정하는 설정입니다. 여기서는 'json' 형식으로 리포트를 출력합니다.
		dryRun: false,													// 'dryRun'은 실제로 테스트를 실행하지 않고 시나리오가 유효한지 확인하는 데 사용됩니다.
		failFast: false,												// 'failFast'는 첫 번째 실패 시 테스트 실행을 멈추게 하는 설정입니다.
		snippets: true,
		source: true,
		strict: false, 													// 'strict'는 테스트가 실패할 경우 경고 없이 바로 실패로 처리합니다.
		timeout: 60000,		 											// 단계 실행 시간 제한
	},
	// 명령어로 입력된 태그가 있을 경우만 동작하도록
	onPrepare: () => {
		if (process.env.CUCUMBER_TAGS) {
		  console.log(`🔔 ${process.env.CUCUMBER_TAGS} 태그를 실행합니다.`);
		} else {
		  console.log(`🔔 기본 태그 '@NonService'를 실행합니다.`);
		}

		// reports/json 폴더가 없으면 생성
		const reportsPath = path.resolve(__dirname, 'reports/cucumber-json');
		if (!fs.existsSync(reportsPath)) {
			fs.mkdirSync(reportsPath, { recursive: true });
			console.log("✅ reports/cucumber-json 폴더가 생성되었습니다.");
		}

		// screenshots 폴더가 없으면 생성
		const screenshotsPath = path.resolve(__dirname, 'screenshots');
		if (!fs.existsSync(screenshotsPath)) {
			fs.mkdirSync(screenshotsPath, { recursive: true });
			console.log("✅ screenshots 폴더가 생성되었습니다.");
		}
	  },

	before: async function () {
		console.log("✅ Test starting...");
		console.log("📌 Device Metadata:", capabilities);
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
		const jsonFilePath = './reports/cucumber-json/report.json';
		const htmlReportPath = './reports/cucumber-html/index.html';

		// 리포트가 생성되었는지 확인하고 생성
		if (fs.existsSync(jsonFilePath)) {
			reporter.generate({
				// Cucumber JSON 리포트를 기반으로 HTML 리포트 생성
				jsonDir: './reports/cucumber-json',
				reportPath: './reports/cucumber-html',
				openReportInBrowser: false, // true : 리포트가 완료되면 브라우저에서 열기
				metadata: {
					browser: {
						name: 'chrome',
						version: '104.0',
					},
					device: 'Local test machine',
					platform: {
						name: 'Windows',
						version: '10'
					}
				},
				customData: {
					title: 'Test Report',
					data: [
						{ label: 'Project', value: 'Appium Cucumber Test' },
						{ label: 'Release', value: '1.0.0' },
						{ label: 'Execution Time', value: new Date().toLocaleString() },
					]
				}
			});
			console.log('✅ HTML 리포트가 성공적으로 생성되었습니다.');
		} else {
			console.error('❌ JSON 리포트 파일을 찾을 수 없습니다.');
		}
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
		// 동영상 생성 확인을 확인하고 파일 목록을 알려줍니다.
		const videoDirectory = './videoReports';
		if (fs.existsSync(videoDirectory)) {
			console.log('✅ 비디오가 저장된 디렉토리:', videoDirectory);
			const files = fs.readdirSync(videoDirectory);
			console.log('현재 비디오 디렉토리의 파일 목록:', files);
		} else {
			console.log('❌ 비디오 디렉토리가 없습니다.');
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
		console.log('✅ onComplete 훅이 실행되었습니다.');
		console.log('✅ exitCode =:', exitCode);
		/**
		* Gets executed when a refresh happens.
		* @param {string} oldSessionId session ID of the old session
		* @param {string} newSessionId session ID of the new session
		*/

		/**
		 * 
		 * 모든 것이 끝나면 Slack으로 전달할때 사용한다.
		 * 
		 */

		// const SLACK_WEBHOOK_URL = "https://hooks.slack.com/services/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";

		// // ✅ 동작한 Device Name 가져오기
		// const deviceName = capabilities[0]['appium:deviceName'];

		// // ✅ 실행된 태그 정보 가져오기
		// const executedTag = process.env.CUCUMBER_TAGS || '@NonService';

		// let statusMessage = "✅ *테스트 성공!* 🎉 모든 시나리오가 통과되었습니다!";
		// if (results.failed > 0) {
		// 	statusMessage = `❌ *테스트 실패!* 🔴 실패한 시나리오: ${results.failed}개`;
		// }

		// // ✅ Slack 메시지에 Device Name & Tag 추가
		// const payload = {
		// 	text: `*테스트 결과 알림*\n${statusMessage}\n\n` +
		// 		`*프로젝트:* TadaDriver\n` +
		// 		`*환경:* 로컬 테스트\n` +
		// 		`*디바이스:* ${deviceName}\n` +
		// 		`*실행된 태그:* ${executedTag}`
		// };

		// try {
		// 	const response = await axios.post(SLACK_WEBHOOK_URL, payload);
		// 	console.log(`✅ Slack 메시지 전송 성공! 응답 코드: ${response.status}`);
		// } catch (error) {
		// 	console.error("❌ Slack 메시지 전송 실패!", error.message);
		// }
		/** 
		 * 테스트는 실패했지만, 스크립트가 모두 동작을 하면 성공으로 되는 경우가 있음.
		 * */
		if (results.failed > 0) {
			console.log("❌ 테스트 실패! Jenkins에서 빌드를 실패로 설정합니다.");
			process.exit(1);  // Jenkins에서 빌드 실패로 처리하도록 설정
		} else {
			console.log("✅ 모든 테스트 성공! Jenkins에서 빌드를 성공으로 설정합니다.");
			process.exit(0);  // 정상 종료
		}
	},

};
