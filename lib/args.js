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
      if (item.trim() === '--help') {
        acc.isHelp = true;
        return acc;
      }
      if (item.trim() === '--custom') {
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
    { version: 'patch', isVerbose: false, all: false, isHelp: false, isCustom: false }
  );

  if (!args.isCustom) {
    delete args.customVersion;
  }

  if (!['major', 'minor', 'patch'].includes(args.version)) {
    throw new Error('We only support [patch, minor, major] for the version.\nTo pass a custom version use --custom');
  }

  // Validate semver
  if (args.isCustom && /^\d{1,3}\.\d{1,3}\.\d{1,3}/.test(args.customVersion)) {
    args.version = args.customVersion || args.version;
    delete args.customVersion;
  }

  return args;
}

const ARGS = getArgs();

module.exports = ARGS;
