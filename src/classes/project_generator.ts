import fs from 'fs';
import ora from 'ora';
import chalk from 'chalk';
import { execSync } from 'child_process';
import PackageManager from './package_manager';
import {
  defaultJsFile,
  defaultTsFile,
  jestJsFile,
  jestTsFile,
} from '../config/misc';

class ProjectGenerator {
  static handleProjectSettings(
    projectName: string,
    pkgManager: string,
    typeScript: boolean,
    extraSettings?: Array<string>,
    tests?: string
  ): void {
    PackageManager.initPackage(projectName, pkgManager);

    if (typeScript) {
      PackageManager.installTsDependencies(pkgManager, projectName);
      ProjectGenerator.initTypeScript(projectName);
    }

    ProjectGenerator.createSourceFolder(projectName, typeScript);
    PackageManager.addPackageDetails(projectName);
    PackageManager.createScripts(projectName, typeScript, extraSettings, tests);

    if (tests === 'Jest') {
      ProjectGenerator.createTestsFolder(projectName, typeScript);
      PackageManager.addJest(projectName, pkgManager, typeScript);
    }

    if (extraSettings) {
      if (extraSettings.includes('Prettier')) {
        PackageManager.addPrettier(projectName, pkgManager);
      }
      if (
        extraSettings.includes('ESLint') &&
        extraSettings.includes('Prettier')
      ) {
        PackageManager.attachLinterWithPrettier(projectName, pkgManager);
      }
      if (extraSettings.includes('dotenv')) {
        PackageManager.addDotenv(projectName, pkgManager, typeScript);
      }
      if (extraSettings.includes('nodemon or ts-node-dev')) {
        PackageManager.addChangesMonitor(projectName, pkgManager, typeScript);
      }
      if (extraSettings.includes('ESLint')) {
        PackageManager.addEslint(projectName, pkgManager);
      }
    }

    console.log(chalk.greenBright('🎉 Ready!'));
    console.log(
      chalk.greenBright(`🚀 cd ${projectName} && ${pkgManager} start`)
    );
  }

  static initTypeScript(projectName: string): void {
    execSync(`cd ${projectName} && npx tsc --init`, { stdio: 'ignore' });
  }

  static createSourceFolder(projectName: string, typeScript: boolean): void {
    const srcSpinner = ora('📂 Creating Source Folder...').start();

    fs.mkdirSync(`${projectName}/src`, { recursive: true });
    typeScript
      ? fs.writeFileSync(`./${projectName}/src/index.ts`, defaultTsFile)
      : fs.writeFileSync(`./${projectName}/src/index.js`, defaultJsFile);

    srcSpinner.succeed('📂 Created Source Folder');
  }

  static createTestsFolder(projectName: string, typeScript: boolean): void {
    const srcSpinner = ora('📂 Creating Tests Folder...').start();

    fs.mkdirSync(`${projectName}/__tests__`, { recursive: true });
    typeScript
      ? fs.writeFileSync(`./${projectName}/__tests__/index.test.ts`, jestTsFile)
      : fs.writeFileSync(
          `./${projectName}/__tests__/index.test.js`,
          jestJsFile
        );
    srcSpinner.succeed('📂 Created Tests Folder');
  }
}

export default ProjectGenerator;
