const { bash, script } = require('./cli');
const { success, log } = require('./log')('proton-version');

async function updateDependencies(list = []) {
  log('updating dependencies');
  for (const dependency of list) {
    await bash('npm update', [dependency]);
    success(`update ${dependency}`);
  }
}

async function updateLock() {
  await script('updatePackageLock.sh');
  success('update lock done');
}

module.exports = { updateDependencies, updateLock };
