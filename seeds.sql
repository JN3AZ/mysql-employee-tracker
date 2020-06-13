USE employeesDB;

INSERT INTO department (id, moniker)
VALUES
(001, "Management"),
(002, "Engineering"),
(003, "Sales"),
(004, "Finance"),
(005, "Legal");

INSERT INTO employeeRole (id, title, salary, department_id)
VALUES
(10, "Owner/CEO", 1000000, 001),
(20, "Chief of Operations", 300000, 001),
(30, "Lead Engineer", 225000, 002),
(40, "Junior Developer", 95000, 002),
(50,"Head of Sales", 90000, 003),
(60,"Sales Lead", 75000, 003),
(70, "Lead-Accountant", 90000, 004),
(80, "Company Lawyer", 100000, 005);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Elon", "Musk",1, Null),
(2, "Sherl", "Sandberg",2, 1),
(3, "John", "Carmack",3, Null),
(4, "Bill", "Gates",4, 1),
(5, "Jeffery", "Lebowski",5, 2),
(6, "Dwight", "Schrute",6, 2),
(7, "Calvin", "Joyner",7, 3),
(8, "Saul", "Goodman",8, Null);

