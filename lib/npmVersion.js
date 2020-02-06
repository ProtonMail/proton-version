const path = require('path');
const fs = require('fs').promises;

const { bash } = require('./cli');
const { log } = require('./log')('proton-version');

async function version(newVersion) {
  await bash('npm version', [newVersion]);
  const buffer = await fs.readFile(path.join(process.cwd(), 'package.json'));
  const { version } = JSON.parse(buffer.toString());
  log(`new version available: ${version}`);
}

module.exports = version;
