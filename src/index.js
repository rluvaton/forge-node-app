const inquirer = require('inquirer');

inquirer
  .prompt([
    {
      type: 'list',
      message: 'Pick the config:',
      name: 'config',
      choices: ['eslint + prettier', 'eslint', 'prettier'],
    },
  ])
  .then((answers) => {
    console.log(answers);
  })
  .catch((error) => {
    console.error(error);
  });
