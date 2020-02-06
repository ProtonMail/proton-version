const { magenta, black, bgYellow, bgCyan, green, bold, red } = require('kleur');
const dedent = require('dedent');

const argv = require('./args');

function formatCommit({
  sha,
  commit: {
    committer: { name, email, date },
    message
  }
}) {
  return dedent`
  commit ${sha}
  Author: ${name} <${email}>
  Date:   ${new Date(date).toUTCString()}
      ${message}`;
}

module.exports = (scope) => {
  const warn = (msg, details) => {
    console.log(magenta(`[${scope}]`), msg);
    details && console.log(details);
    console.log();
  };

  const log = (msg) => {
    console.log(`[${scope}] ${msg}`);
  };
  const logCommit = (scope, commit) => {
    console.log(black().bgYellow(`[${scope}]`), formatCommit(commit));
    console.log();
  };

  const success = (msg, { time, space = false } = {}) => {
    const txt = green().bold('✔ ');
    const message = [`[${scope}] `, txt, msg, time && `(${time})`].filter(Boolean).join('');
    space && console.log();
    console.log(message);
  };

  const title = (msg) => {
    console.log(bgCyan().black(msg));
  };

  const json = (data, output, extraLine = true) => {
    // only output for a command
    if (output) {
      return console.log(JSON.stringify(data, null, 2));
    }

    extraLine && console.log();
    console.log(`[${scope}]`, JSON.stringify(data, null, 2));
    console.log();
  };

  const error = (e) => {
    console.log(`[${scope}] ${(red(' ⚠'), red(e.message))}`);
    console.log();
    console.error(e);
    process.exit(1);
  };

  function debug(item, message = 'debug') {
    if (!argv.isVerbose) {
      return;
    }
    if (Array.isArray(item) || typeof item === 'object') {
      console.log(`[${scope}]`, message);
      return json(item, false, false);
    }

    console.log(`[${scope}] ${message} ${item}`);
  }

  return {
    success,
    logCommit,
    debug,
    title,
    error,
    json,
    log,
    warn
  };
};
