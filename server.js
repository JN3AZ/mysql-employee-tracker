// Here are the dependencies for the project
const inquirer = require('inquirer');
const mysql = require('mysql');

// setting up the mysql database connection
const connection = mysql.createConnection({
    host        :   'localhost',
    port        :   '3306',  
    user        :   'root',
    password    :   "",
    databasse   :   "employeesDB"
});

//here we are going to begin the connection to mysql 
connection.connect(function (err) {
    if (err) throw err;
    //begins the app
    startApp();
});

function startApp();

// Here is the set up to start the questions for the user
inquirer.prompt({
    name: 'startQuestions',
    type: 'list',
    message: 'How shall you begin?', 
    choices: ['Exit','Add another employee', 'Delete an employee','Add another role','See all employees', 
    'Search for an employee', 'View employee by department', 'View employee by role']
}).then(function(response) {

    switch (response.startQuestions) {
        case "Exit":
           connection.end();
           break; 
        
        case "Add another employee":
            addEmployee();
            break;
        case   "Delete an employee":
            deleteEmployee();
            break;

        case   "Add another role":
            addRole();
            break;

        case   "See all employees":
                seeEmployees();
                break;

        case   "Search for an employee":
                    locateEmployee();
                    break;

        case   "View employee by department":
                        viewEmployee_Dartment();
                        break;

        case   "View employee by role":
                            viewEmployee_Role();
                            break;                
        }
});
