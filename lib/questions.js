const prompts = require('prompts');

const { PROTON_DEPENDENCIES_NPM } = require('./config');
const args = require('./args');
const { logCommit, log, title } = require('./log')('proton-version');

function getUpdatableDependencies(list) {
  return list.reduce((acc, { dependency, remote, local }) => {
    const latestLocal = remote.find(({ sha }) => sha === local.commit);
    const [latestRemote] = remote;
    if (latestLocal && latestLocal.sha !== latestRemote.sha) {
      acc.push({ dependency, remote, local, latestLocal, latestRemote });
    }
    return acc;
  }, []);
}

async function flow(data) {
  if (args.all) {
    return PROTON_DEPENDENCIES_NPM;
  }
  const list = getUpdatableDependencies(data);

  if (list.length) {
    const { displayDiff } = await prompts([
      {
        type: 'confirm',
        name: 'displayDiff',
        message: `We found ${list.length} dependencies to update. Do you want to see the diff (what's inside your lock and what's available on remote)?`,
        initial: false,
        alreadyPrint: false,
        onRender() {
          // Because MacOS will print twice...
          if (this.alreadyPrint) {
            return;
          }
          log('dependencies we can update');
          console.log(list.map(({ dependency }) => ' -' + dependency).join('\n'));
          this.alreadyPrint = true;
        }
      }
    ]);

    if (displayDiff) {
      list.forEach(({ latestLocal, latestRemote, dependency }) => {
        title(`######### [${dependency}] ########`);
        logCommit('latestLocal', latestLocal);
        logCommit('latestRemote', latestRemote);
      });
    }

    const { optionUpdate } = await prompts([
      {
        type: 'select',
        name: 'optionUpdate',
        message: 'Do you want to update them?',
        choices: [
          {
            title: 'None',
            description: 'We will not update these dependencies',
            value: 'none'
          },
          {
            title: 'All',
            description: `We will update the ${list.length} dependencies`,
            value: 'all'
          },
          {
            title: 'Custom',
            description: 'I want to select what needs to be updayed',
            value: 'custom'
          }
        ],
        initial: 1
      }
    ]);

    if (optionUpdate === 'custom') {
      const { selection } = await prompts([
        {
          type: 'multiselect',
          name: 'selection',
          message: 'Select what you want to update',
          choices: list.map(({ dependency }) => ({
            title: dependency,
            value: dependency
          })),
          hint: '- Space to select. Return to submit'
        }
      ]);

      return selection;
    }
    if (optionUpdate === 'all') {
      return list.map(({ dependency }) => dependency);
    }

    return [];
  }
}

module.exports = flow;
