const mysql = require("mysql");
const inquirer = require("inquirer");


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

//Select All for departments and roles
const selectAllFrom = (table) => (`SELECT * FROM ${table};`);

//function selectAllFrom(table) {
//    return `SELECT * FROM ${table};`
//  }

//Select All employees
const selectAllEmployees = () => (``);

//Insert Department SQL Statement
const insertDepartment = (value) => (`INSERT INTO ${DEPARTMENTS_TABLE}(dept_name) VALUES('${value}');`);
//Insert Employee SQL Statement
const insertEmployee = (employee) => (`INSERT INTO ${EMPLOYEES_TABLE}(first_name, last_name, role_id) VALUES('${employee.first_name}', '${employee.last_name}', '${employee.role_id}');`);
//Insert Role SQL Statement
const insertRole = (role) => (`INSERT INTO ${ROLES_TABLE}(title, salary, dept_id) VALUES("${role.title}", "${role.salary}", "${role.dept_id}");`);


//Debugging Callback
function debugQuery(error, results) {
    if (error) {
        console.log("Error");
        console.log("=========================");
        console.log(error);
        console.log("=========================");
        throw error;
    }
    console.log("Results");
    console.log("=========================");
    console.log(results);
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
            console.log("Department Action");
            console.log("=========================");
            console.log(answer.actionDept);
            console.log("=========================");
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
    console.log("Query");
    console.log("=========================");
    console.log(query);
    console.log("=========================");
    connectToDB.query(query, debugQuery);
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
    console.log("Adding Department");
    console.log("=========================");
    console.log(`Adding ${departmentToAdd} to ${DEPARTMENTS_TABLE}`);
    console.log(deptQuery);
    console.log("=========================");
    connectToDB.query(deptQuery, debugQuery);
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
            console.log("Employee Action");
            console.log("=========================");
            console.log(answer.actionEmp);
            console.log("=========================");
            switch (answer.actionEmp) {
                case "Add":
                    addEmpl();
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

function addEmpl() {
    console.log("Adding Employee");
    console.log("=========================");
    console.log(`Adding ${employeeToAdd} to ${EMPLOYEES_TABLE}`);
    console.log("=========================");
   //const query = insertEmployee(employeeToAdd);
  
    connectToDB.query(query, emplPrompt);
};

const emplPrompt = (err, results) => {
    let choiceArray = results.map((roleObj) => ({ short: roleObj.name, name: roleObj.name, value: roleObj.id }));
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

function viewEmpl() {
    const emplQuery = selectAllFrom(EMPLOYEES_TABLE);
    console.log("Query");
    console.log("=========================");
    console.log(emplQuery);
    console.log("=========================");
    connectToDB.query(emplQuery, debugQuery);
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
            console.log("Role Action");
            console.log("=========================");
            console.log(answer.actionRole);
            console.log("=========================");
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
    console.log("Query");
    console.log("=========================");
    console.log(queryTxt);
    console.log("=========================");
    connectToDB.query(queryTxt, debugQuery);
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
    console.log("Adding Role");
    console.log("=========================");
    console.log(`Adding to ${ROLES_TABLE}`);
    console.log("=========================");
    const createRoleStmt = insertRole(roleToAdd);
    connectToDB.query(createRoleStmt, debugQuery);
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


/*   connectToDB.query(
       `INSERT INTO ${tblName} SET ?`,
       itemToInsert,
       function (err) {
           if (err) {
               throw err;
           }
           console.log(`Your ${answer.tblChoice} was added to ${tblName} successfully!`);
           start();
       }

   ); */