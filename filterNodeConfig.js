const fs = require('fs');
const nodeConfig = require('./nodeconfig.json');

const deviceName = process.env.DEVICE_NAME;  // Jenkins에서 설정한 환경 변수

const filteredConfig = nodeConfig.capabilities.filter(device => device['appium:deviceName'] === deviceName);

fs.writeFileSync('./filtered-nodeconfig.json', JSON.stringify({ capabilities: filteredConfig }, null, 2));
