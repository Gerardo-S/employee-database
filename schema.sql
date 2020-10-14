-- DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department(
id INT AUTO_INCREMENT,
department_name VARCHAR(30),
PRIMARY KEY(id)
);

SELECT * FROM department;
-- ==========================================================
CREATE TABLE employee_role (
id INT AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL(10,2),
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(id),
PRIMARY KEY(id)
);

SELECT * FROM employee_role;
-- ===========================================================
CREATE TABLE employees(
id INT AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
FOREIGN KEY(role_id) REFERENCES employee_role(id),
manager_id INT,
PRIMARY KEY(id),
FOREIGN KEY(manager_id) REFERENCES employees(id)
);

SELECT * FROM employees;
-- ====================================================================================================
-- employee table with manager names column 
SELECT e.id, e.first_name, e.last_name, e.role_id, CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employees AS e
LEFT JOIN employees AS m
ON e.manager_id = m.id;
-- ===================================================================================================
-- employee table with Employee ID |Fisrt Name| Last Name| Manager| Title |Salary
SELECT e.id, e.first_name, e.last_name, employee_role.title, employee_role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id
LEFT JOIN employee_role ON e.role_id= employee_role.id
-- ======================================================================================================================================
-- Taking new table and merging with department to obtain table with All employees 
-- Employee ID |Fisrt Name| Last Name| Title| Department |Salary| manager
SELECT e.id, e.first_name, e.last_name, employee_role.title, department.department_name, employee_role.salary, CONCAT(m.first_name, " ", m.last_name) AS manager
FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id LEFT JOIN employee_role ON e.role_id= employee_role.id
LEFT JOIN department ON employee_role.department_id= department.id;