const path = require('path');
const got = require('got');

const { PROTON_DEPENDENCIES } = require('./config');
const argv = require('./args');
const { log, debug, success } = require('./log')('proton-version');

async function getCommits(project) {
  try {
    debug(`https://api.github.com/repos/ProtonMail/${project}/commits`);
    const response = await got(`https://api.github.com/repos/ProtonMail/${project}/commits`);
    return JSON.parse(response.body);
  } catch (e) {
    e.message = `[${project}] ${e.message}`;
    throw e;
  }
}

function getLocalProjects() {
  const dep = PROTON_DEPENDENCIES.reduce((acc, key) => (acc[key] = true, acc), {});

  const { dependencies } = require(path.join(process.cwd(), 'package-lock.json'));
  return Object.entries(dependencies).reduce((acc, [ key, value ]) => {
    if (dep[key]) {
      const [ , commit ] = value.version.split('#');
      const [ , branch ] = value.from.split('#');
      const rawTag = branch.includes('semver') ? branch.split(':')[1] : '';
      const [ tag = '' ] = (rawTag.match(/\d+\.\d+\.\d+/) || []);
      acc[key] = { commit, branch, tag };
    }
    return acc;
  }, {});
}

async function getDependenciesConfig() {

  // We won't need this as we return all the PROTON_DEPENDENCIES_NPM
  if (argv.all) {
    return
  }

  if (argv.isMock) {
    log('load mock dependencies');
    return require(path.join(__dirname, '..', 'all2.json'));
  }

  const localConfig = getLocalProjects();
  debug(localConfig);

  const promises = Object.entries(localConfig).map(async ([ dependency, local ]) => ({
    dependency,
    remote: await getCommits(dependency),
    local
  }));

  const data = await Promise.all(promises);
  success('fetch commits from API');
  return data;
}
module.exports = { getLocalProjects, getCommits, getDependenciesConfig };
