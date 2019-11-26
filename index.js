const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Allison",
    database: "employeeTrack_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function addTableEntry(answer) {
    console.log(answer.tblChoice);
    let tblName;
    let itemToInsert = {};
    let prompt;
    switch (answer.tblChoice) {
        case "Department":
            tblName = "department";
            prompt = {
                type: "input",
                name: "deptName",
                message: "What is the name of the department to add?",
            };
            inquirer
                .prompt(prompt).then((answer) => {
                    itemToInsert.dept_name = answer.deptName;
                }
                );
            break;
        case "Role":
            tblName = "employee_roles";
            prompt = [{
                type: "input",
                name: "tblChoice",
                message: "What would you like to add?",
                choices: [
                    "Department",
                    "Role",
                    "Employee"
                ]
            }];
            inquirer
                .prompt(prompt).then(

                );
            break;
        case "Employee":
            tblName = "employee";
            prompt = [{
                type: "input",
                name: "tblChoice",
                message: "What would you like to add?",
                choices: [
                    "Department",
                    "Role",
                    "Employee"
                ]
            }]
            inquirer
                .prompt(prompt).then(

                );
            break;
        default:
            console.log("Wut??");
            break;
    }

    connection.query(
        `INSERT INTO ${tblName} SET ?`,
        itemToInsert,
        function (err) {
            if (err) {
                throw err;
            }
            console.log(`Your ${answer.tblChoice} was added to ${tblName} successfully!`);
            start();
        }

    );
};

function addOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "tblChoice",
            message: "What would you like to add?",
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(addTableEntry);
};

function viewOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "viewChoice",
            message: "What would you like to view?",
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function (answer) {
            console.log(answer.viewChoice);
            switch (answer.viewChoice) {
                case "Department":
                    viewDept();
                    break;
                case "Role":
                    viewRole();
                    break;
                case "Employee":
                    viewEmpl();
                    break;
                default:
                    console.log("Wut??");
                    break;
            }
        })
};

function updateOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "updateChoice",
            message: "What would you like to update?",
            choices: [
                "Employee Role",
                "Employee Manager"
            ]
        })
        .then(function (answer) {
            console.log(answer.updateChoice);
        })
};

function deleteOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "deleteChoice",
            message: "What would you like to delete?",
            choices: [
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function (answer) {
            console.log(answer.deleteChoice);
        })
};


function start() {
    inquirer
        .prompt({
            type: "list",
            name: "actionChoice",
            message: "What would you like to do?",
            choices: [
                "Add",
                "View",
                "Update",
                "Delete"
            ]
        })
        .then(function (answer) {
            switch (answer.actionChoice) {
                case "Add":
                    addOptions();
                    break;
                case "View":
                    viewOptions();
                    break;
                case "Update":
                    updateOptions();
                    break;
                case "Delete":
                    deleteOptions();
                    break;
                default:
                    console.log("Wut??");
                    break;
            }
        });
};