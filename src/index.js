const inquirer = require('inquirer');
const { questions } = require('./helpers/questions');
const { handleProjectSettings } = require('./helpers/project_generator');

async function buildProject() {
  const answers = await inquirer
    .prompt(questions)
    .catch((error) => console.error(error));

  handleProjectSettings(
    answers.projectName,
    answers.pkgManager,
    answers.typeScript,
    answers.extraSettings
  );
}

buildProject();
