const prompts = require('prompts');
const dedent = require('dedent');

const { bash } = require('./cli');
const { success, log, warn, debug } = require('./log')('proton-version');

async function manage() {
  // Find active npm links
  const { stdout } = await bash(`find node_modules -maxdepth 1 -type l`);
  const activeNpmLinks = stdout.split('\n').filter(Boolean);
  debug(activeNpmLinks);

  if (!activeNpmLinks.length) {
    return; // Nothing to see there
  }

  const removeLinks = await prompts({
    type: 'confirm',
    name: 'unlink',
    message: `we need to unlink, do you confirm?`,
    initial: true,
    alreadyPrint: false,
    onRender() {
      // Because MacOS will print twice...
      if (this.alreadyPrint) {
        return;
      }

      const links = activeNpmLinks.join('\n');
      const msg = dedent`we detected active npm links,
        It is impossible to update the package-lock.json if we have active links
        Active npm link detected:`;
      warn(msg, activeNpmLinks.map((name) => ' -' + name).join('\n'));
      this.alreadyPrint = true;
    }
  });

  if (!removeLinks.unlink) {
    log('stopping the process');
    process.exit(0);
  }

  log('unlinking dependencies');

  /*
    Remove the dependency instead of running npm unlink or npm uninstall --no-save
    Because we get the weird error Error [0], same one you get if you run npm install
    and you already have active npm links inside the node_modules.

    rm -rf does the job, and we can update them... npm ¯\_(ツ)_/¯
   */
  for (const link of activeNpmLinks) {
    // We don't want to remove something else than the active npm link. Security
    if (!/^node_modules/.test(link)) {
      return warn(`We cannot remove the current npm link ${link}`);
    }
    await bash('rm -rf', [link]);
    success(`unlinking ${link}`);
  }
}

module.exports = manage;
