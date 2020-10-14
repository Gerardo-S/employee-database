var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected!");
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "exit"

            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    viewAllEmployees();
                    break;

                case "View All Employees By Department":
                    viewByDepartment();
                    break;

                case "View All Employees By Manager":
                    viewByManager();
                    break;

                case "Add Employee":
                    addEmployee();
                    break;

                case "Remove Employee":
                    removeEmployee();
                    break;

                case "Update Employee Role":
                    updateEmpRole();
                    break;

                case "Update Employee Manager":
                    updateEmpManager();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
};

// ================================================== View All Employees =======================================================================================================================
function viewAllEmployees() {
    let query = "SELECT e.id, e.first_name, e.last_name, employee_role.title, department.department_name, employee_role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager";
    query += " FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id LEFT JOIN employee_role ON e.role_id= employee_role.id";
    query += " LEFT JOIN department ON employee_role.department_id= department.id;";
    connection.query(query, (err, result) => {
        if (err) {
            throw err;
        }
        console.table(result);
        start();

    });

};
// ====================================================== View All Employees End ==================================================================================================================



