const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");


const connectToDB = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Allison",
    database: "employeeTrack_db"
});

connectToDB.connect(function (err) {
    if (err) throw err;
    start();
});

const DEPARTMENTS_TABLE = "department";
const ROLES_TABLE = "employee_role";
const EMPLOYEES_TABLE = "employee";


const selectAllFrom = (table) => (`SELECT * FROM ${table};`);

//Select All employees
const selectAllEmployees = () => (`SELECT emp.id AS "Employee ID", emp.first_name AS "First Name", emp.last_name AS "Last Name", roles.title AS "Job Title", roles.salary AS "Salary", roles.dept_name AS "Department" 
                                    FROM ${EMPLOYEES_TABLE} AS emp JOIN 
                                       (SELECT role.id, role.title, role.salary, dept.dept_name 
                                        FROM ${ROLES_TABLE} AS role JOIN 
                                        ${DEPARTMENTS_TABLE} AS  dept WHERE role.dept_id = dept.id) AS roles 
                                    WHERE emp.role_id = roles.id;`);

//Insert Department SQL Statement
const insertDepartment = (value) => (`INSERT INTO ${DEPARTMENTS_TABLE}(dept_name) VALUES('${value}');`);

//Insert Employee SQL Statement
const insertEmployee = (employee) => (`INSERT INTO ${EMPLOYEES_TABLE}(first_name, last_name, role_id) VALUES('${employee.first_name}', '${employee.last_name}', '${employee.role_id}');`);

//Insert Role SQL Statement
const insertRole = (role) => (`INSERT INTO ${ROLES_TABLE}(title, salary, dept_id) VALUES("${role.title}", "${role.salary}", "${role.dept_id}");`);

//logging results callback
function outputResults(error, results) {
    if (error) {
        console.log("Error");
        console.log("=========================");
        console.log(error);
        console.log("=========================");
        throw error;
    }
    console.log("Results");
    console.log("=========================");
    console.table(results);
    console.log("=========================");
    start();
};

//Departments
function deptOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "actionDept",
            message: "What action would you like to take regarding Departments?",
            choices: [
                "Add",
                "View",
                "Return to Main"
            ]
        })
        .then(function (answer) {
            switch (answer.actionDept) {
                case "Add":
                    getDeptToAdd();
                    break;
                case "View":
                    viewDept();
                    break;
                case "Return to Main":
                    start();
                default:
                    console.log("Wut??");
                    break;
            }
        })
};

function viewDept() {
    const query = selectAllFrom(DEPARTMENTS_TABLE);
    connectToDB.query(query, outputResults);
};

function getDeptToAdd() {
    const promptObj = {
        type: "input",
        name: "newDeptName",
        message: "Enter new department name:"
    };
    inquirer.prompt(promptObj).then(addDept);
};

function addDept(userRes) {
    const departmentToAdd = userRes.newDeptName;
    const deptQuery = insertDepartment(departmentToAdd);
    connectToDB.query(deptQuery, outputResults);
};

//Employees
function empOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "actionEmp",
            message: "What action would you like to take regarding employees?",
            choices: [
                "Add",
                "View",
                "Update Role",
                "Return to Main"
            ]
        })
        .then(function (answer) {
            switch (answer.actionEmp) {
                case "Add":
                    getEmployeeToAdd();
                    break;
                case "View":
                    viewEmpl();
                    break;
                case "Update Role":
                    updateEmplRole();
                    break;
                case "Return to Main":
                    start();
                default:
                    console.log("Wut??");
                    break;
            }
        })
};

function getRoleChoices(callback) {
    const query = selectAllFrom(ROLES_TABLE);
    connectToDB.query(query, callback);
};

function emplPrompt(err, results) {
    let choiceArray = results.map((roleObj) => ({ short: roleObj.title, name: roleObj.title, value: roleObj.id }));
    const promptObj = [{
        type: "input",
        name: "first_name",
        message: "Enter employee's first name:"
    },
    {
        type: "input",
        name: "last_name",
        message: "Enter new employee's last name:"
    },
    {
        type: "list",
        name: "role_id",
        message: "Choose employee's role:",
        choices: choiceArray
    }]
    inquirer.prompt(promptObj).then(addEmpl);
}

function getEmployeeToAdd() {
    getRoleChoices(emplPrompt);
}

function addEmpl(employeeToAdd) {
    const employeeAddStmt = insertEmployee(employeeToAdd);
    connectToDB.query(employeeAddStmt, outputResults);
};

function viewEmpl() {
    const emplQuery = selectAllEmployees();
    connectToDB.query(emplQuery, outputResults);
};

function updateEmplRole() {

};


//Roles
function roleOptions() {
    inquirer
        .prompt({
            type: "list",
            name: "actionRole",
            message: "What action would you like to take regarding Roles?",
            choices: [
                "Add",
                "View",
                "Return to Main"
            ]
        })
        .then(function (answer) {
            switch (answer.actionRole) {
                case "Add":
                    getRoleToAdd();
                    break;
                case "View":
                    viewRoles();
                    break;
                case "Return to Main":
                    start();
                default:
                    console.log("Wut??");
                    break;
            }
        })
};

function viewRoles() {
    const queryTxt = selectAllFrom(ROLES_TABLE);
    connectToDB.query(queryTxt, outputResults);
};

function getDeptChoices(callback) {
    const query = selectAllFrom(DEPARTMENTS_TABLE);
    connectToDB.query(query, callback);
}

function getRoleToAdd() {
    const showPrompt = (err, results) => {
        let choiceArray = results.map((deptObj) => ({ short: deptObj.dept_name, name: deptObj.dept_name, value: deptObj.id }));
        const promptObj = [{
            type: "input",
            name: "title",
            message: "Enter new role title:"
        },
        {
            type: "input",
            name: "salary",
            message: "Enter new role salary:"
        },
        {
            type: "list",
            name: "dept_id",
            message: "Choose department of new role:",
            choices: choiceArray
        }]
        inquirer.prompt(promptObj).then(addRole);
    }
    getDeptChoices(showPrompt);

};

function addRole(roleToAdd) {
    const createRoleStmt = insertRole(roleToAdd);
    connectToDB.query(createRoleStmt, outputResults);
};


//Start App
function start() {
    inquirer
        .prompt({
            type: "list",
            name: "subjectChoice",
            message: "What would you like to modify?",
            choices: [
                "Department",
                "Employee",
                "Role",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.subjectChoice) {
                case "Department":
                    deptOptions();
                    break;
                case "Employee":
                    empOptions();
                    break;
                case "Role":
                    roleOptions();
                    break;
                case "Exit":
                    process.exit(0);
                default:
                    console.log("Wut??");
                    break;
            }
        });
};

