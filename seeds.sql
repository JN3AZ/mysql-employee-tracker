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
(1, "Owner", 1000000, 1),
(2, "Chief of Operations", 250000, 1),
(3, "Lead Engineer", 225000, 2),
(4, "Junior Developer", 95000, 2),
(5,"Head of Sales", 90000, 3),
(6,"Sales Lead", 75000, 3),
(7, "Lead-Accountant", 90000, 4),
(8, "Company Lawyer", 100000, 5);
