#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const htmlToText = require('html-email-to-text');

const log = console.log;

// Define some helper functions

// Check that the file exists, if it does exist then the
// programme may proceed, else kill it and alert the user
// via a prompt in the terminal.
fileExists = (file) => {
  try {
    return fs.statSync(file).isFile() && path.extname(file) === '.html';
  } catch (err) {
    console.log(chalk.red('❗   That ain\'t no HTML file ❗'))
    return false;
  }
}

getFilePath = () => {
  const getPath = [
    {
      name: 'file',
      type: 'input',
      message: 'Gimme the path to your file:',
      validate: (value) => {
        if (value.length) {
          return true;
        } else {
          return 'Hmm.. that doesn\'t seem right, try again'
        }
      }
    }
  ];
  return inquirer.prompt(getPath);
}

init = async () => {
  try {
    const file = await getFilePath();
    if (fileExists(file.file)) {
      const fileArray = file.file.split('.');
      log(chalk.green('Let\'s do this!'));
      log(chalk(`We're going to convert ${chalk.underline.bold(file.file)} and create a new file called ${chalk.underline.bold(fileArray[0] + '.txt')}`));
      const contents = await fs.readFileSync(file.file, 'utf8');
      const text = await htmlToText(contents);

      fs.writeFile(fileArray[0] + '.txt', text, (err) => {
        if (err) log(chalk.red('Something wen\'t wrong!'));
        log(chalk.green(`Successfully created ${chalk.underline.bold(fileArray[0] + '.txt')}`));
      });
    }
  } catch (err) {
    console.log(chalk.red('Something wen\'t wrong'));
  }
}

// Let's do this
init();