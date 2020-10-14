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
                // Done
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
    let query = "SELECT e.id, e.first_name, e.last_name, employee_role.title, department.department_name AS department, employee_role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager";
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

// ======================================================View Employees by Department =============================================================================================================
function viewByDepartment() {
    return connection.query("SELECT * FROM department;", (err, results) => {
        if (err) {
            throw err;
        }
        const listDepartments = results.map((row) => row.department_name);

        return inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    message: "What department would you like to see?",
                    choices: listDepartments,
                },

            ])
            .then((answer) => {
                let query = "SELECT department.department_name AS department, e.id, e.first_name, e.last_name, employee_role.title, employee_role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager";
                query += " FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id LEFT JOIN employee_role ON e.role_id= employee_role.id";
                query += " LEFT JOIN department ON employee_role.department_id= department.id WHERE department_name = ?;";
                connection.query(query, [answer.choice], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.table(result);
                    start();

                });

            });
    });
};
// ===================================================================================================== View Employees by Department End =========================================================================

// ======================================================View Employees by Manager =============================================================================================================
function viewByManager() {
    let query = "SELECT e.id, e.first_name, e.last_name, employee_role.title, employee_role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager";
    query += " FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id"
    query += " LEFT JOIN employee_role ON e.role_id= employee_role.id;"
    connection.query(query, (err, results) => {
        if (err) {
            throw err;
        }
        const listManagersColumn = results.map((row) => row.manager);
        const listMangagersNames = listManagersColumn.filter((name) => { return name != null });

        return inquirer
            .prompt([
                {
                    name: "choice",
                    type: "list",
                    message: "Under which manager would you like to see corresponding employees?",
                    choices: listMangagersNames,
                },

            ])
            .then((answer) => {
                console.log(answer);
                let query = "SELECT  CONCAT(m.first_name, ' ', m.last_name) AS manager, e.id, e.first_name, e.last_name, employee_role.title, department.department_name AS department, employee_role.salary";
                query += " FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id LEFT JOIN employee_role ON e.role_id= employee_role.id";
                query += " LEFT JOIN department ON employee_role.department_id= department.id WHERE CONCAT(m.first_name, ' ', m.last_name) = ?;";
                connection.query(query, [answer.choice], (err, result) => {
                    if (err) {
                        throw err;
                    }
                    console.table(result);
                    start();

                });

            });
    });
};
// ===================================================================================================== View Employees by Manager End =========================================================================

// ==================================================================================================== Add Employee to database ================================================================================

function addEmployee() {

    return connection.query("SELECT * FROM employee_role;", (err, results) => {
        if (err) {
            throw err;
        }
        const listRoles = results.map((row) => row.title);
        let queryManagers = "SELECT e.id, e.first_name, e.last_name, employee_role.title, employee_role.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager";
        queryManagers += " FROM employees AS e LEFT JOIN employees AS m ON e.manager_id = m.id"
        queryManagers += " LEFT JOIN employee_role ON e.role_id= employee_role.id;"

        connection.query(queryManagers, (err, resultsM) => {
            if (err) {
                throw err;
            }
            const listManagersColumn = resultsM.map((row) => row.manager);
            const listMangagersNames = listManagersColumn.filter((name) => { return name != null });

            console.log(listMangagersNames);
            console.log(listRoles);

            return inquirer
                .prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's first name?",
                    },

                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's last name?",
                    },

                    {
                        name: "rolechoice",
                        type: "list",
                        message: "What is the employee's role?",
                        choices: listRoles,
                    },

                    {
                        name: "managerchoice",
                        type: "list",
                        message: "Who is the employee's manager?",
                        choices: listMangagersNames,
                    },


                ])
                .then((answer) => {
                    console.log(answer.firstName);
                    console.log(answer.lastName);
                    console.log(answer.rolechoice);
                    console.log(answer.managerchoice);
                    console.log("Success!")
                    // when finished prompting, insert a new item into the db with that info
                    // return connection.query(
                    //     "INSERT INTO auctions SET ?",
                    //     {
                    //         item_name: answer.item,
                    //         category: answer.category,
                    //         starting_bid: answer.startingBid || 0,
                    //         highest_bid: answer.startingBid || 0,
                    //     },
                    //     (err) => {
                    //         if (err) {
                    //             throw err;
                    //         }
                    //         console.log("Your auction was created successfully!");
                    //         // re-prompt the user for if they want to bid or post
                    //         return start();
                    //     }
                    // );
                });
        });

    });

};
// =============================================================================================================== Add employee End =====================================================================================================