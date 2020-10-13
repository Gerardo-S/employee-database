INSERT INTO department (department_name)
VALUES 
("Sales"),
("Engineering"),
("Finance"),
("Legal");
-- ================================================================
INSERT INTO employee_role (title, salary, department_id)
VALUES
("Sales Lead", 100000, 1),
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Account Manager", 125000, 3),
("Accountant", 125000, 3),
("Legal Team Lead", 250000, 4),
("Lawyer", 190000, 4);
-- ===================================================================
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1, 1),
("Mike", "Chan", 2,NULL),
("Ashley", "Rodriguez", 3,2),
("Kevin", "Tupik", 4, NULL),
("Malia", "Brown", 6,NULL),
("Sarah", "Lourd", 7, 3),
("Tom", "Allen", 4, NULL);
