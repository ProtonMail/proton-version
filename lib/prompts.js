const prompts = require('prompts');

async function main(questions, opt = {}) {
  return prompts(questions, {
    onCancel() {
      // Exit ex via CTRL+C
      process.exit(130);
    },
    ...opt
  });
}

module.exports = main;
