// Here are the dependencies for the project
const inquirer = require('inquirer');
const mysql = require('mysql');

// setting up the mysql database connection
const connection = mysql.createConnection({
    host        :   'localhost',
    user        :   'root',
    password    :   "",
    databasse   :   "employeesDB"

 

});