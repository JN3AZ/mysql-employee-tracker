USE employeeDB;

INSERT INTO department (id, moniker)
VALUES
(1, "Management"),
(2, "Engineering"),
(3, "Sales"),
(4, "Finance"),
(5, "Legal");

INSERT INTO employeeRole (id, title, salary, department_id)
VALUES
(1, "Owner/CEO", 1000000, 1),
(2, "Chief of Operations", 300000, 1),
(3, "Lead Engineer", 225000, 2),
(4, "Junior Developer", 95000, 2),
(5,"Head of Sales", 90000, 3),
(6,"Sales Lead", 75000, 3),
(7, "Lead-Accountant", 90000, 4),
(8, "Company Lawyer", 100000, 5);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
(1, "Elon", "Musk",1, 1),
(1, "Sherl", "Sandberg",2, 1),
(1, "John", "Carmack",3, 3),
(1, "Bill", "Gates",4, 3),
(1, "Jeffery", "Lebowski",5, 2),
(1, "Dwight", "Schrute",6, 2),
(1, "Calvin", "Joyner",7, 4),
(1, "Saul", "Goodman",8, 5),

