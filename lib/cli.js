const path = require('path');
const execa = require('execa');
const { debug } = require('./log')('proton-version');

const bash = (cli, args = [], stdio) => {
    debug({ cli, args, stdio }, 'bash');
    return execa(cli, args, { shell: '/bin/bash', stdio });
};

module.exports = { bash };
