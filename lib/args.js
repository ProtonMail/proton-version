const dedent = require('dedent');

function getArgs() {
  const args = process.argv.slice(2).reduce(
    (acc, item, i) => {
      if (item.trim() === '--verbose') {
        acc.isVerbose = true;
        return acc;
      }
      if (item.trim() === '--all') {
        acc.all = true;
        return acc;
      }
      if (item.trim() === '--mock') {
        acc.isMock = true;
        return acc;
      }
      if (item.trim() === '--help') {
        acc.isHelp = true;
        return acc;
      }
      if (item.trim() === '--custom-version') {
        acc.isCustom = true;
        return acc;
      }
      if (!i) {
        acc.version = item || acc.version;
      }
      if (i) {
        acc.customVersion = (item || '').trim();
      }
      return acc;
    },
    { version: 'patch', isVerbose: false, all: false, isHelp: false, isCustom: false, isMock: false }
  );

  if (!args.isCustom) {
    delete args.customVersion;
  }

  if (!['major', 'minor', 'patch'].includes(args.version)) {
    throw new Error(
      'We only support [patch, minor, major] for the version.\nTo pass a custom version use --custom-version'
    );
  }

  // Validate semver
  if (args.isCustom && /^\d{1,3}\.\d{1,3}\.\d{1,3}/.test(args.customVersion)) {
    args.version = args.customVersion || args.version;
    delete args.customVersion;
  }

  return args;
}

const ARGS = getArgs();

if (ARGS.isHelp) {
  const help = dedent`
Create a new version and detects if there is a new version available for you dependencies.
It will:
  - detect and ask you if we need to updat them
  - commit the new lockfile
  - run npm version
> Auto detect them via the package.json

Usage:
$ proton-version <patch|minor|major>
Flags:
  --verbose
  --all: Auto update all dependencies from proton
  --help: Display the help
  --custom-versio <value>: Custom version _must be valid semver_
`;
  console.log(help);
  process.exit(0);
}

module.exports = ARGS;
