const mysql = require("mysql");
const inquirer = require("inquirer");


const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password: "Allison",
    database:"employeeTrack_db"
});

connection.connect(function(err){
    if (err) throw err;
    start();
});

function addOptions(){
    inquirer
        .prompt({
            type:"list",
            name: "addChoice",
            message: "What would you like to add?",
            choices:[
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function(answer) {
            console.log(answer.addChoice);
        })
};

function viewOptions(){
    inquirer
    .prompt({
        type:"list",
        name: "viewChoice",
        message: "What would you like to view?",
        choices:[
            "Department",
            "Role",
            "Employee"
        ]
    })
    .then(function(answer) {
        console.log(answer.viewChoice);
    })
};

function updateOptions(){
    inquirer
        .prompt({
            type:"list",
            name: "updateChoice",
            message: "What would you like to update?",
            choices:[
                "Employee Role",
                "Employee Manager"
            ]
        })
        .then(function(answer) {
            console.log(answer.updateChoice);
        })
};

function deleteOptions(){
    inquirer
        .prompt({
            type:"list",
            name: "deleteChoice",
            message: "What would you like to delete?",
            choices:[
                "Department",
                "Role",
                "Employee"
            ]
        })
        .then(function(answer) {
            console.log(answer.deleteChoice);
        })
};


function start (){
    inquirer
        .prompt({
            type:"list",
            name: "actionChoice",
            message: "What would you like to do?",
            choices:[
                "Add",
                "View",
                "Update",
                "Delete"
            ]
        })
        .then(function(answer) {
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
        })
}