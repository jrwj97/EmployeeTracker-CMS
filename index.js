const mysql = require("mysql2");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");

require("dotenv").config();

const connection = (mysql = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "employee_db",
}));

connection.connect((err) => {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  promptUser();
});

const promptUser = () => {
  inquirer.prompt([
    {
      type: "list",
      name: "choices",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Update an employee manager",
        "View employees by department",
        "Delete a department",
        "Delete an employee",
        "Delete a role",
        "View department budgets",
        "No action",
      ],
    },
  ])
  .then((answers) => {
    const { choices } = answers;
    if (choices === "View all departments") {
      showDepartments();
    }
    if (choices === "View all roles") {
      showRoles();
    }
    if (choices === "View all employees") {
      showEmployees();
    }
    if (choices === "Add a department") {
      addDepartment();
    }
    if (choices === "Add a role") {
      addRole();
    }
    if (choices === "Add an employee") {
      addEmployee();
    }
    if (choices === "Update an employee role") {
      updateRole();
    }
    if (choices === "Update an employee manager") {
      updateManager();
    }
    if (choices === "View employees by department") {
      viewEmployeesByDepartment();
    }
    if (choices === "Delete a department") {
      deleteDepartment();
    }
    if (choices === "Delete a role") {
      deleteRole();
    }
    if (choices === "Delete an employee") {
      deleteEmployee();
    }
    if (choices === "View department budgets") {
      viewBudgets();
    }
    if (choices === "No action") {
      connection.end();
    }
  })
};

showDepartments = () => {
  console.log("Show all departments...\n");
  const sql = "SELECT department.id AS id, department.name AS department FROM department;";

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
  })
}