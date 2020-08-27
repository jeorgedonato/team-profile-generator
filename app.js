const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const path = require("path");
const fs = require("fs");
const inquirer = require('inquirer');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");

// const qType = {
//   Manager: { type: 'input', name: 'fourthParam', message: 'What is the office number?' },
//   Engineer: { type: 'input', name: 'fourthParam', message: 'What is the github username?' },
//   Intern: { type: 'input', name: 'fourthParam', message: 'What is the school name?' }
// };
// const employeeArr = [];

function Employee() {
  this.qType = {
    Manager: { type: 'input', name: 'fourthParam', message: 'What is the office number?' },
    Engineer: { type: 'input', name: 'fourthParam', message: 'What is the github username?' },
    Intern: { type: 'input', name: 'fourthParam', message: 'What is the school name?' }
  };
  this.employeeArr = [];
}

Employee.prototype.startPrompt = function () {
  inquirer.prompt([{
    type: 'list',
    name: 'userType',
    message: 'Which of the following choices are you going to add?',
    choices: ['Manager', 'Engineer', 'Intern']
  }]).then(({ userType }) => {
    this.userPrompt(userType);
  });
};

Employee.prototype.userPrompt = function (userType) {
  inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Please provide the name of employee.',
    default: 'John Doe'
  },
  {
    type: 'input',
    name: 'id',
    message: 'Please provide the id number of the employee.',
    default: () => {
      return this.employeeArr.length + 1;
    }
  },
  {
    type: 'input',
    name: 'email',
    message: 'Please provide the email of the employee.',
    default: 'johndoe@email.com'
  },
  this.qType[userType],
  {
    type: 'confirm',
    name: 'addMore',
    message: 'Do you want to add more?'
  }
  ]).then(({ name, id, email, fourthParam, addMore }) => {

    switch (userType) {
      case 'Manager':
        this.employeeArr.push(new Manager(name, id, email, fourthParam));
        break;
      case 'Engineer':
        this.employeeArr.push(new Engineer(name, id, email, fourthParam));
        break;
      case 'Intern':
        this.employeeArr.push(new Intern(name, id, email, fourthParam));
        break;
      default:
        this.employeeArr.push(new Manager(name, id, email, fourthParam));
        break;
    }
    if (addMore) {
      console.log(`${("-").repeat(100)} \nAdd another employee \n${("-").repeat(100)}`);
      this.startPrompt();
    } else {
      const renderedHtml = render(this.employeeArr);
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
      }
      fs.writeFile(outputPath, renderedHtml, err => {
        if (err) throw err;
        console.log(`${("-").repeat(100)} \nThe file has been created!\n Check your file here ' + ${outputPath} + ' \n${("-").repeat(100)}`);
      });
    }
  }).catch(err => {
    console.log(err);
    return;
  });
};

const emp = new Employee();
emp.startPrompt();


