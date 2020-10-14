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



// Code below is work in progress 
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
                    // for the following lines I am trying to find a way to corelate user input for employee role to the role_id in order to update the table
                    // At first I was going to use if statements but I figured it might be easier to write a for loop. With a for loop if additional roles are added there would not be 
                    // a need to update the code. 
                    // const role_id = 

                    // for (let i = 0; i < array.length; i++) {
                    //     const element = array[i];
                        
                    // }

                    // if(answer.rolechoice == "Sales Lead"){
                    //     return answer.rolechoice = 1;
                    // }
                    // else if(answer.rolechoice == "Salesperson"){
                    //     return answer.rolechoice = 2;
                    // }
                    // else if(answer.rolechoice == "Lead Engineer"){
                    //     return answer.rolechoice = 3;
                    // }
                    // else if(answer.rolechoice == "Software Engineer"){
                    //     return answer.rolechoice = 4;
                    // }
                    // else if(answer.rolechoice == "Account Manager"){
                    //     return answer.rolechoice = 5;
                    // }
                    // else if(answer.rolechoice == "Account Manager"){
                    //     return answer.rolechoice = 5;
                    // }
                    // when finished prompting, insert a new item into the db with that info
                    // Here I was trying to update the respective tables according to user input 
                    // let updateEmployeeQuery= "INSERT INTO employees(first_name, last_name) SET ?;"
                    // connection.query(

                    //     updateEmployeeQuery,

                    //     // "INSERT INTO auctions SET ?",

                    //     {
                    //         first_name: answer.firstName,
                    //         last_name: answer.lastName,
                    //         role_id: 
                        
                    //     },
                    //     (err) => {
                    //         if (err) {
                    //             throw err;
                    //         }
                    //         console.log("successfully added employee!");
                            
                    //         // return start();
                    //     }
                    // );
                });
        });

    });

};
// =============================================================================================================== Add employee End =====================================================================================================