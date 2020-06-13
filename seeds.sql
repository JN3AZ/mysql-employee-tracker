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
(10, "Owner/CEO", 1000000, 1),
(20, "Chief of Operations", 300000, 1),
(30, "Lead Engineer", 225000, 2),
(40, "Junior Developer", 95000, 2),
(50,"Head of Sales", 90000, 3),
(60,"Sales Lead", 75000, 3),
(70, "Lead-Accountant", 90000, 4),
(80, "Company Lawyer", 100000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Elon", "Musk",1, 1),
(2, "Sherl", "Sandberg",2, 1),
(3, "John", "Carmack",3, 3),
(4, "Bill", "Gates",4, 3),
(5, "Jeffery", "Lebowski",5, 2),
(6, "Dwight", "Schrute",6, 2),
(7, "Calvin", "Joyner",7, 4),
(8, "Saul", "Goodman",8, 5);

