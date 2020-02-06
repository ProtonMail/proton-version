const path = require('path');

const { dependencies, version } = require(path.join(process.cwd(), 'package.json'));
const PROTON_DEPENDENCIES = Object.entries(dependencies).reduce((acc, [ key, value ]) => {
  if (/ProtonMail/.test(value)) {
    if (key === 'mimemessage') {
      acc.push('mimemessage.js');
      return acc;
    }
    acc.push(key);
  }
  return acc;
}, []);

// Thx mimemessage which is ref as mimemessage.js on Github but mimemessage for npm...
const PROTON_DEPENDENCIES_NPM =  PROTON_DEPENDENCIES.map((dep) => {
  if (dep === 'mimemessage.js') {
    return 'mimemessage';
  }
  return dep;
});

module.exports = { PROTON_DEPENDENCIES, PROTON_DEPENDENCIES_NPM, PKG_VERSION: version };
