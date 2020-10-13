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
FOREIGN KEY (department_id) REFERENCES employee_role(id),
PRIMARY KEY(id)
);

SELECT * FROM employee_role;
-- ===========================================================
CREATE TABLE employees(
id INT AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INT,
manager_id INT,
PRIMARY KEY(id),
FOREIGN KEY(manager_id) REFERENCES employees(id)
);

SELECT * FROM employees;