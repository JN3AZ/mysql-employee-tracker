// Here are the dependencies for the project
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// setting up the mysql database connection
const connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "employeesDB",
});

//here we are going to begin the connection to mysql
connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  //begins the app
  startApp();
});
//start the Employee Tracker
function startApp() {
  menuPrompt();
}

// here we are initializing the user prompts
function menuPrompt() {
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
        "Delete a Role",
        "Add a Department",
        "Delete a Department",
        "See all employees",
        "View Roles",
        "View Departments",
        "View employee by department",
        "View employee by role",
        "Update an Employees Role",
        // "Update an Employees Manager",
        "Exit",
      ],
    })
    .then(function (answer) {
      switch (answer.startQuestions) {
        case "Add another employee":
          addEmployee();
          break;

        case "Delete an employee":
          deleteEmployee();
          break;

        case "Add another role":
          addRole();
          break;

        case "Delete a Role":
          deleteRole();
          break;

        case "Add a Department":
          addDepartment();
          break;

        case "Delete a Department":
          deleteDepartment();
          break;

        case "See all employees":
          seeEmployees();
          break;

        case "View Roles":
          seeRolesOnly();
          break;

        case "View Departments":
          seeDepartmentsOnly();
          break;

        case "View employee by department":
          viewEmployee_Department();
          break;

        case "View employee by role":
          viewEmployee_Role();
          break;

        case "Update an Employees Role":
          updateEmployeeRole();
          break;

        // case "Update an Employees Manager":
        //   updateEmployeeManager();
        //   break;

        case "Exit":
          connection.end();
          break;
      }
    });
}

// Here is the process to add a new employee to the database
function addEmployee() {
  connection.query("SELECT * FROM employeeRole", function (err, res) {
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
      .then(function (answer) {
        connection.query(
          "SELECT * FROM employeeRole WHERE ?",
          { title: answer.roleChoice },
          function (err, res) {
            if (err) throw err;

            connection.query("INSERT INTO employee SET ?", {
              first_name: answer.firstName,
              last_name: answer.lastName,
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
    .then(function (answer) {
      connection.query(
        "DELETE FROM employee WHERE first_name = ? and last_name = ?",
        [answer.firstName, answer.lastName],
        function (err) {
          if (err) throw err;

          console.log(
            `\n ${answer.firstName} ${answer.lastName} has been deleted from the database. \n`
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
      .then(function (answer) {
        connection.query(
          "SELECT * FROM department WHERE ?",
          { moniker: answer.departmentChoice },
          function (err, res) {
            if (err) throw err;
            console.log(res[0].id);

            connection.query("INSERT INTO employeeRole SET ?", {
              title: answer.roleTitle,
              salary: parseInt(answer.roleSalary),
              department_id: parseInt(res[0].id),
            });

            console.log("\n Role has been added to database... \n");
          }
        );

        promptExit();
      });
  });
}

// Remove a role from the database
function deleteRole() {
  const query = "SELECT id, employeeRole.title FROM employeeRole;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract department names to array
    const roles = [];
    const rolesNames = [];
    for (let i = 0; i < res.length; i++) {
      roles.push({
        id: res[i].id,
        title: res[i].title,
      });
      rolesNames.push(res[i].title);
    }
    //prompt for role to remove
    inquirer
      .prompt({
        type: "list",
        name: "rolesPromptChoice",
        message: "Select Role to delete",
        choices: rolesNames,
      })
      .then((answer) => {
        //get id of chosen department
        const chosenRole = answer.rolesPromptChoice;
        let chosenRoleID;
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].title === chosenRole) {
            chosenRoleID = roles[i].id;
            break;
          }
        }
        const query = "DELETE FROM employeeRole WHERE ?";
        connection.query(query, { id: chosenRoleID }, (err, res) => {
          if (err) throw err;
          console.log("Role Removed");
        });
      });
  });
}

// adds a department created by the user.
function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "addDepartment",
      message: "What is the department you want to add?",
    })
    .then(function (answer) {
      connection.query(
        "INSERT INTO department SET ?",
        { moniker: answer.addDepartment },
        function (err) {
          if (err) throw err;
        }
      );

      console.log("\n Department added to database... \n");

      promptExit();
    });
}

// Remove a department from the database
function deleteDepartment() {
  const query = "SELECT id, moniker FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract department names to array
    const departments = [];
    const departmentsNames = [];
    for (let i = 0; i < res.length; i++) {
      departments.push({
        id: res[i].id,
        moniker: res[i].moniker,
      });
      departmentsNames.push(res[i].moniker);
    }
    //prompt for department to remove
    inquirer
      .prompt({
        type: "list",
        name: "departmentsPromptChoice",
        message: "Select Department to delete",
        choices: departmentsNames,
      })
      .then((answer) => {
        //get id of chosen department
        const chosenDepartment = answer.departmentsPromptChoice;
        let chosenDepartmentId;
        for (let i = 0; i < departments.length; i++) {
          if (departments[i].moniker === chosenDepartment) {
            chosenDepartmentId = departments[i].id;
            break;
          }
        }
        const query = "DELETE FROM department WHERE ?";
        connection.query(query, { id: chosenDepartmentId }, (err, res) => {
          if (err) throw err;
          console.log("Department Removed");
          promptExit();
        });
      });
  });
}

// Here is the setup that allows all of the employees to be viewed by the user.
function seeEmployees() {
  var employeeArray = [];
  var employeeObj;

  var query =
    "SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employeeRole ON (employee.role_id = employeeRole.id) JOIN department ON (department.id = employeeRole.department_id)";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.log("response: ", res);
    for (var i = 0; i < res.length; i++) {
      employeeObj = {
        id: res[i].id,
        firstName: res[i].first_name,
        lastName: res[i].last_name,
        title: res[i].title,
        salary: res[i].salary,
        moniker: res[i].moniker,
      };
      employeeArray.push(employeeObj);
    }

    console.log("\n");
    console.table(
      ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
      employeeArray
    );
    console.log("\n");

    promptExit();
  });
}

// Query the Roles only and display them for viewing
function seeRolesOnly() {
  var employeeRoleArray = [];
  var employeeRolesObj;
  const query = "SELECT * FROM employeesDB.employeeRole;";
  //build table data array from query result
  connection.query(query, (err, res) => {
    if (err) throw err;
    for (let i = 0; i < res.length; i++) {
      employeeRolesObj = {
        id: res[i].id,
        title: res[i].title,
        salary: res[i].salary,
        department_id: res[i].department_id,
      };
      employeeRoleArray.push(employeeRolesObj);
    }
    console.log("\n");
    console.table(employeeRoleArray);
    console.log("\n");
    promptExit();
  });
}

// Query the departments without employees
function seeDepartmentsOnly() {
  var departmentsArray = [];
  var departmentsObj;
  const query = "SELECT * FROM department;";
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract department names to array

    for (let i = 0; i < res.length; i++) {
      departmentsObj = {
        id: res[i].id,
        moniker: res[i].moniker,
      };
      departmentsArray.push(departmentsObj);
    }
    console.log("\n");
    console.table(departmentsArray);
    console.log("\n");
    promptExit();
  });
}

//setting up the ablity to search for an employee based off of the department they belong to.
function viewEmployee_Department() {
  var query =
    "SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employeeRole ON (employee.role_id = employeeRole.id) JOIN department ON (department.id = employeeRole.department_id)";

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

          console.log("\n");
          console.table(
            ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
            fullDepartmentArray
          );
          console.log("\n");

          promptExit();
        });
      });
  });
}

// searches employee by role
function viewEmployee_Role() {
  var query = `SELECT employee.id, first_name, last_name, title, salary, moniker FROM employee JOIN employeeRole ON (employee.role_id = employeeRole.id) JOIN department ON (department.id = employeeRole.department_id)`;

  connection.query("SELECT * FROM employeeRole", function (err, res) {
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

          console.log("\n");
          console.table(
            ["ID", "First Name", "Last Name", "Role", "Salary", "Department"],
            fullRoleArray
          );
          console.log("\n");

          promptExit();
        });
      });
  });
}

function updateEmployeeRole() {
  let employees = [];
  let employeeRoles = [];
  //initialize updatedEmployee object
  let updatedEmployee = {
    id: 0,
    roleID: 0,
  };
  //sql query for Employees
  let query = `SELECT id, concat(employee.first_name, " ", employee.last_name) AS employee_full_name
  FROM employee;`;
  connection.query(query, (err, res) => {
    if (err) throw err;
    //extract employee names and ids to arrays

    for (let i = 0; i < res.length; i++) {
      employees.push({
        id: res[i].id,
        employee_full_name: res[i].employee_full_name,
      });
    }
    //prompt for employee to update
    inquirer
      .prompt({
        type: "list",
        name: "employeePromptChoice",
        message: "Select employee to update:",
        choices: employees,
      })
      .then((answer) => {
        //get id of chosen employee
        const chosenEmployee = answer.employeePromptChoice;
        let chosenEmployeeID;
        for (let i = 0; i < employees.length; i++) {
          if (employees[i].employee_full_name === chosenEmployee) {
            chosenEmployeeID = employees[i].id;
            break;
          }
        }
        //set updatedEmployee id
        updatedEmployee.id = chosenEmployeeID;
        //sql query for roles
        const query = `SELECT id, title FROM employeeRole;`;
        connection.query(query, (err, res) => {
          if (err) throw err;
          //extract role names and ids to arrays

          let rolesNames = [];
          for (let i = 0; i < res.length; i++) {
            rolesNames.push({
              id: res[i].id,
              title: res[i].title,
            });
          }
          //prompt for role selection
          inquirer
            .prompt({
              type: "list",
              name: "rolePromptChoice",
              message: "Select Role:",
              choices: rolesNames,
            })
            .then((answer) => {
              //get id of chosen role
              const chosenRole = answer.rolePromptChoice;
              let chosenRoleID;
              for (let i = 0; i < rolesNames.length; i++) {
                if (rolesNames[i].title === chosenRole) {
                  chosenRoleID = rolesNames[i].id;
                  break;
                }
              }
              //set updatedEmployee role ID
              updatedEmployee.roleID = chosenRoleID;
              //sql query to update role
              const query = `UPDATE employee SET ? WHERE ?`;
              connection.query(
                query,
                [
                  {
                    role_id: updatedEmployee.roleID,
                  },
                  {
                    id: updatedEmployee.id,
                  },
                ],
                (err, res) => {
                  if (err) throw err;
                  console.log("Employee Role Updated");
                }
              );
            });
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
      choices: ["Run Again", "Exit"],
    })
    .then(function (answer) {
      if (answer.promptExit === "Run Again") {
        startApp();
      } else {
        connection.end();
      }
    });
}
