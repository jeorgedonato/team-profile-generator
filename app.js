const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const path = require("path");
const fs = require("fs");
const inquirer = require('inquirer');

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const render = require("./lib/htmlRenderer");
console.log(outputPath)
const qType = {
  Manager: { type: 'input', name: 'fourthParam', message: 'What is the office number?' },
  Engineer: { type: 'input', name: 'fourthParam', message: 'What is the github username?' },
  Intern: { type: 'input', name: 'fourthParam', message: 'What is the school name?' }
};
const employeeArr = [];

const startPrompt = () => {
  inquirer.prompt([{
    type: 'list',
    name: 'userType',
    message: 'Which of the following choices are you going to add?',
    choices: ['Manager', 'Engineer', 'Intern']
  }]).then(({ userType }) => {
    userPrompt(userType);
  });
};

const userPrompt = userType => {
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
      return employeeArr.length + 1;
    }
  },
  {
    type: 'input',
    name: 'email',
    message: 'Please provide the email of the employee.',
    default: 'johndoe@email.com'
  },
  qType[userType],
  {
    type: 'confirm',
    name: 'addMore',
    message: 'Do you want to add more?'
  }
  ]).then(({ name, id, email, fourthParam, addMore }) => {

    switch (userType) {
      case 'Manager':
        employeeArr.push(new Manager(name, id, email, fourthParam));
        break;
      case 'Engineer':
        employeeArr.push(new Engineer(name, id, email, fourthParam));
        break;
      case 'Intern':
        employeeArr.push(new Intern(name, id, email, fourthParam));
        break;
      default:
        employeeArr.push(new Manager(name, id, email, fourthParam));
        break;
    }
    if (addMore) {
      console.log('----------------------------------- \n Add another employee \n -----------------------------------');
      startPrompt();
    } else {
      const renderedHtml = render(employeeArr);
      fs.writeFile(outputPath, renderedHtml, err => {
        if (err) throw err;
        console.log('----------------------------------- \nThe file has been created!\n -----------------------------------');
      });
    }
  }).catch(err => {
    console.log(err);
    return;
  });
};

startPrompt();
// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)
// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

