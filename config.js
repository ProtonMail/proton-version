const os = require('os');

const REACT_COMPONENTS = 'git@github.com:ProtonMail/react-components.git';
const PROTON_SHARED = 'git@github.com:ProtonMail/proton-shared.git';
const PMCRYPTO = 'git@github.com:ProtonMail/pmcrypto.git';

const OUTPUT_DIR = os.tmpdir();

module.exports = {
    GIT: {
        REACT_COMPONENTS,
        PROTON_SHARED,
        PMCRYPTO
    },
    OUTPUT_DIR
};
