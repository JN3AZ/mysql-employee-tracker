-- Used queries in the application

-- Queries to add new Employees, Departments and Roles:
-- Query to insert new Employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (?, ?, ?, ?);

-- Query to insert departments
INSERT INTO department (id, moniker)
VALUES (?, ?);

-- Query to insert Roles
INSERT INTO employeeRole (id, title, salary, department_id)
VALUES (?, ?, ?, ?);


-- Queries to View Employees, Departments and Roles:
-- Query to view Employees
SELECT * FROM employee where employee_id like 2;

-- Query to view Departments
SELECT * FROM department where department_id like 3;

-- Query to view Roles
SELECT * FROM employeeRole where role_id like 4;

-- Queries to update employee Roles
UPDATE employees SET employeeRole = 3 WHERE employee_id like 2;

