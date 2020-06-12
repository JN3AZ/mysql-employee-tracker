// Here are the dependencies for the project
const inquirer = require("inquirer");
const mysql = require("mysql");

// setting up the mysql database connection
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  databasse: "employeesDB",
});

//here we are going to begin the connection to mysql
connection.connect(function (err) {
  if (err) throw err;
  //begins the app
  startApp();
});

function startApp() {
  // Here is the set up to start the questions for the user
  inquirer
    .prompt({
      name: "startQuestions",
      type: "list",
      message: "How shall you begin?",
      choices: [
        "Exit",
        "Add another employee",
        "Delete an employee",
        "Add another role",
        "See all employees",
        "Search for an employee",
        "View employee by department",
        "View employee by role",
      ],
    })
    .then(function (res) {



      switch (res.startQuestions) {
        case "Add another employee":
          addEmployee();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Add another role":
          addRole();
          break;

        case "See all employees":
          seeEmployees();
          break;

        case "Search for an employee":
          locateEmployee();
          break;

        case "View employee by department":
          viewEmployee_Department();
          break;

        case "View employee by role":
          viewEmployee_Role();
          break;

        case "Exit":
          connection.end();
          break;
      }
    });
}


//Here is the process to add a new employee to the database
function addEmployee() {

    connection.query("SELECT * FROM employee_role", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "Employee's First Name?:"
            },
            {
                name: "lastName",
                type: "input",
                message: "Employee's Last Name?:"
            },
            {
                name: "roleChoice",
                type: "rawlist",
                message: "Employee's role?",
                choices: function () {
                    var arrOptions = [];

                    for (var i = 0; i < res.length; i++) {
                        arrOptions.push(res[i].title);
                    }

                    return arrOptions;
                }
            }
        ]).then(function (res) {

            connection.query("SELECT * FROM employeeRole WHERE ?", { title: res.roleChoice }, function (err, res) {
                if (err) throw err;

                connection.query("INSERT INTO employee SET ?", {
                    first_name: res.firstName,
                    last_name: res.lastName,
                    role_id: res[0].id
                });

                console.log("\n Employee added to the database. \n");
            })

            promptExit();
        });
    })
}

// Setting up the ability to delete an employee from database
function deleteEmployee() {

    inquirer.prompt([
        {
            name: "firstName",
            type: "input",
            message: "What is the Employee's First Name?"
        },
        {
            name: "lastName",
            type: "input",
            message: "What is the Employee's Last Name?"
        }
    ]).then(function (res) {

        connection.query("DELETE FROM employee WHERE first_name = ? and last_name = ?", [res.firstName, res.lastName], function (err) {
            if (err) throw err;

            console.log(`\n ${res.firstName} ${res.lastName} has been deleted from the database. \n`)
            promptExit();
        })


    });

}

// adds role
function addRole() {

    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;

        inquirer.prompt([
            {
                name: "roleTitle",
                type: "input",
                message: "Enter the title for this role"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "Enter the salary for this role"
            },
            {
                name: "departmentChoice",
                type: "rawlist",
                message: "Choose a department associated with this role",
                choices: function () {
                    var arrOptions = [];

                    for (var i = 0; i < res.length; i++) {
                        arrOptions.push(res[i].department_name);
                    }

                    return arrOptions;
                }
            }
        ]).then(function (res) {

            connection.query("SELECT * FROM department WHERE ?", { department_name: res.departmentChoice }, function (err, res) {
                if (err) throw err;
                console.log(result[0].id);

                connection.query("INSERT INTO employee_role SET ?", {
                    title: res.roleTitle,
                    salary: parseInt(res.roleSalary),
                    department_id: parseInt(res[0].id)
                });

                console.log("\n Role has been added to database... \n");
            })

            promptExit();
        });

    })

}















// function showAllEmployees() {

//     var allEmployeeArray = [];

//     var query = "SELECT employee.id, first_name, last_name, title, salary, department_name FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

//     connection.query(query, function(err, result) {
//         if (err) throw err;

//         var employeeArray = [];


//         for(var i = 0; i < result.length; i++) {

//             employeeArray = [];



//             employeeArray.push(result[i].id);
//             employeeArray.push(result[i].first_name);
//             employeeArray.push(result[i].last_name);
//             employeeArray.push(result[i].title);
//             employeeArray.push(result[i].salary);
//             employeeArray.push(result[i].department_name);

//             // console.log(employeeArray);


//             allEmployeeArray.push(employeeArray);

//         }

//         // console.log(allEmployeeArray);

//         console.log("\n\n\n");
//         console.table(["ID", "First Name", "Last Name", "Role", "Salary", "Department"], allEmployeeArray);
//         console.log("\n\n\n");

//         promptQuit();


//     });

// }










































































































































//Gives two choices to the user,  if they want to exit the app or keep using the application.
function promptExit() {
    inquirer.prompt({
        type: "list",
        name: "promptExit",
        message: "Would you like to quit this application or run again?",
        choices: ["Run Again", "Quit"]
    }).then(function (res) {

        if (res.promptExit === "Run Again") {
            runApp();
        } else {
            connection.end();
        }


    });
}
