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
        "Add another employee",
        "Delete an employee",
        "Add another role",
        "Add a Department",
        "See all employees",
        "Search for an employee",
        "View employee by department",
        "View employee by role",
        "Exit",
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

        case "Add another department":
          addDepartment();
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

    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Employee's First Name?:",
        },
        {
          name: "lastName",
          type: "input",
          message: "Employee's Last Name?:",
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
          },
        },
      ])
      .then(function (res) {
        connection.query(
          "SELECT * FROM employeeRole WHERE ?",
          { title: res.roleChoice },
          function (err, res) {
            if (err) throw err;

            connection.query("INSERT INTO employee SET ?", {
              first_name: res.firstName,
              last_name: res.lastName,
              role_id: res[0].id,
            });

            console.log("\n Employee added to the database. \n");
          }
        );

        promptExit();
      });
  });
}

// Setting up the ability to delete an employee from database
function deleteEmployee() {
  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "What is the Employee's First Name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the Employee's Last Name?",
      },
    ])
    .then(function (res) {
      connection.query(
        "DELETE FROM employee WHERE first_name = ? and last_name = ?",
        [res.firstName, res.lastName],
        function (err) {
          if (err) throw err;

          console.log(
            `\n ${res.firstName} ${res.lastName} has been deleted from the database. \n`
          );
          promptExit();
        }
      );
    });
}

// adds a role created by the user.
function addRole() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "roleTitle",
          type: "input",
          message: "Enter the title for this role",
        },
        {
          name: "roleSalary",
          type: "input",
          message: "Enter the salary for this role",
        },
        {
          name: "departmentChoice",
          type: "rawlist",
          message: "Choose a department associated with this role",
          choices: function () {
            var arrOptions = [];

            for (var i = 0; i < res.length; i++) {
              arrOptions.push(res[i].moniker);
            }

            return arrOptions;
          },
        },
      ])
      .then(function (res) {
        connection.query(
          "SELECT * FROM department WHERE ?",
          { moniker: res.departmentChoice },
          function (err, res) {
            if (err) throw err;
            console.log(res[0].id);

            connection.query("INSERT INTO employee_role SET ?", {
              title: res.roleTitle,
              salary: parseInt(res.roleSalary),
              department_id: parseInt(res[0].id),
            });

            console.log("\n Role has been added to database... \n");
          }
        );

        promptExit();
      });
  });
}


// adds a department created by the user.
function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "addDepartment",
        message: "What is the department you want to add?"

    }).then(function (answer) {

        connection.query('INSERT INTO department SET ?', { moniker: answer.addDepartment }, function (err) {
            if (err) throw err;
        });

        console.log("\n Department added to database... \n");

        promptExit();
    });
}


// Here is the setup that allows all of the employees to be viewed by the user.
function seeEmployees() {
  var listOfEmployeesArray = [];

  var query =
    "SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  connection.query(query, function (err, res) {
    if (err) throw err;

    var employeeArray = [];

    for (var i = 0; i < res.length; i++) {
      employeeArray = [];

      employeeArray.push(res[i].id);
      employeeArray.push(res[i].first_name);
      employeeArray.push(res[i].last_name);
      employeeArray.push(res[i].title);
      employeeArray.push(res[i].salary);
      employeeArray.push(res[i].moniker);

      allEmployeeArray.push(employeeArray);
    }

    console.log("\n\n\n");
    console.table(
      ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
      listOfEmployeesArray
    );
    console.log("\n\n\n");

    promptExit();
  });
}

////setting up the ability to search for a specific employee
function locateEmployee() {
  var query =
    "SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  inquirer
    .prompt([
      {
        name: "firstName",
        type: "input",
        message: "Employee's First Name?",
      },
      {
        name: "lastName",
        type: "input",
        message: "Employee's Last Name?",
      },
    ])
    .then(function (answer) {
      var fullEmployeeArray = [];
      var searchEmployeeArray = [];

      connection.query(query, function (err, res) {
        if (err) throw err;

        // search database for specific searched employee
        for (var i = 0; i < res.length; i++) {
          if (
            result[i].first_name === answer.firstName &&
            result[i].last_name === answer.lastName
          ) {
            searchEmployeeArray.push(res[i].id);
            searchEmployeeArray.push(res[i].first_name);
            searchEmployeeArray.push(res[i].last_name);
            searchEmployeeArray.push(res[i].title);
            searchEmployeeArray.push(res[i].salary);
            searchEmployeeArray.push(res[i].moniker);

            fullEmployeeArray.push(searchEmployeeArray);
          }
        }

        console.log("\n\n\n");
        console.table(
          ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
          fullEmployeeArray
        );
        console.log("\n\n\n");

        promptExit();
      });
    });
}

//setting up the ablity to search for an employee based off of the department they belong to.
function viewEmployee_Department() {
  var query =
    "SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "What is the department you would like to view?",
          choices: function () {
            var arrChoices = [];

            for (var i = 0; i < res.length; i++) {
              arrChoices.push(res[i].moniker);
            }

            return arrChoices;
          },
        },
      ])
      .then(function (answer) {
        var fullDepartmentArray = [];
        var searchDepartmentArray = [];

        connection.query(query, function (err, res) {
          if (err) throw err;

          // matches employee's by specific department
          for (var i = 0; i < res.length; i++) {
            if (res[i].moniker === answer.departmentName) {
              searchDepartmentArray.push(res[i].id);
              searchDepartmentArray.push(res[i].first_name);
              searchDepartmentArray.push(res[i].last_name);
              searchDepartmentArray.push(res[i].title);
              searchDepartmentArray.push(res[i].salary);
              searchDepartmentArray.push(res[i].moniker);

              fullDepartmentArray.push(searchDepartmentArray);
            }
          }

          console.log("\n\n\n");
          console.table(
            ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
            fullDepartmentArray
          );
          console.log("\n\n\n");

          promptQuit();
        });
      });
  });
}

// searches employee by role
function viewEmployee_Role() {
  var query =
    "SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employee_role ON (employee.role_id = employee_role.id) JOIN department ON (department.id = employee_role.department_id)";

  connection.query("SELECT * FROM employee_role", function (err, res) {
    if (err) throw err;

    console.log(res);

    inquirer
      .prompt([
        {
          name: "roleName",
          type: "rawlist",
          message: "What is the role you would like to view?",
          choices: function () {
            var arrChoices = [];

            for (var i = 0; i < res.length; i++) {
              arrChoices.push(res[i].title);
            }

            return arrChoices;
          },
        },
      ])
      .then(function (answer) {
        var fullRoleArray = [];
        var searchRoleArray = [];

        connection.query(query, function (err, res) {
          if (err) throw err;

          // matches employee's by specific department
          for (var i = 0; i < res.length; i++) {
            if (res[i].title === answer.roleName) {
              searchRoleArray.push(res[i].id);
              searchRoleArray.push(res[i].first_name);
              searchRoleArray.push(res[i].last_name);
              searchRoleArray.push(res[i].title);
              searchRoleArray.push(res[i].salary);
              searchRoleArray.push(res[i].moniker);

              fullRoleArray.push(searchRoleArray);
            }
          }

          console.log("\n\n\n");
          console.table(
            ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
            fullRoleArray
          );
          console.log("\n\n\n");

          promptQuit();
        });
      });
  });
}

//Gives two choices to the user,  if they want to exit the app or keep using the application.
function promptExit() {
  inquirer
    .prompt({
      type: "list",
      name: "promptExit",
      message: "Would you like to quit this application or run again?",
      choices: ["Run Again", "Quit"],
    })
    .then(function (res) {
      if (res.promptExit === "Run Again") {
        runApp();
      } else {
        connection.end();
      }
    });
}
