const path = require('path');
const got = require('got');

const argv = require('./args');
const { log, debug } = require('./log')('proton-version');

async function getCommits(project) {
  const response = await got(`https://api.github.com/repos/ProtonMail/${project}/commits`);
  return JSON.parse(response.body);
}

function getLocalProjects() {
  const dep = {
    'react-components': true,
    'proton-shared': true,
    'design-system': true,
    'pmcrypto': true
  };

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

  return Promise.all(promises);
}
module.exports = { getLocalProjects, getCommits, getDependenciesConfig };
