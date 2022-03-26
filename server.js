const inquirer = require("inquirer");
const db = require("./db/connection");
const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

db.connect((err) => {
  if (err) throw err;
  console.log("Database connected.");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  promptUser();
});

const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a job",
          "Add an employee",
          "Update an employee job",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;
      if (choices === "View all departments") {
        showDepartments();
      }
      if (choices === "View all roles") {
        showJobs();
      }
      if (choices === "View all employees") {
        showEmployees();
      }
      if (choices === "Add a department") {
        addDepartment();
      }
      if (choices === "Add a job") {
        addJob();
      }
      if (choices === "Add an employee") {
        addEmployee();
      }
      if (choices === "Update an employee job") {
        updateJob();
      }
    });
};

showDepartments = () => {
  const sql =
    "SELECT department.id AS id, department.name AS department FROM department;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

showJobs = () => {
  const sql = "SELECT job.id AS id, job.title AS job FROM job;";

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

showEmployees = () => {
  const sql = `SELECT employee.id, 
  employee.first_name, 
  employee.last_name, 
  job.title, 
  department.name AS department,
  job.salary, 
  CONCAT (manager.first_name, " ", manager.last_name) AS manager
FROM employee
  LEFT JOIN job ON employee.job_id = job.id
  LEFT JOIN department ON job.department_id = department.id
  LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

addDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDept",
        message: "What department do you want to add?",
        validate: (newDept) => {
          if (newDept) {
            return true;
          } else {
            console.log("Please enter a department");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name)
                    VALUES (?)`;
      db.query(sql, answer.newDept, (err, result) => {
        if (err) throw err;
        console.log("Added " + answer.newDept + " to departments!");

        showDepartments();
      });
    });
};

addJob = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newJob",
        message: "What is the new job you want to add?",
        validate: (addJob) => {
          if (addJob) {
            return true;
          } else {
            console.log("Please enter a job");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the job?",
      },
    ])
    .then((answer) => {
      const params = [answer.newJob, answer.salary];

      const sqlRole = "SELECT name, id FROM department";
      db.query(sqlRole, (err, data) => {
        if (err) throw err;

        const dept = data.map(({ name, id }) => ({ name: name, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "What department is this job in?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const dept = deptChoice.dept;
            params.push(dept);

            const sql = `INSERT INTO job (title, salary, department_id) VALUES (?, ?, ?)`;

            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("Added " + answer.newJob + " to jobs!");
              showJobs();
            });
          });
      });
    });
};

addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employees first name?",
        validate: (addName) => {
          if (addName) {
            return true;
          } else {
            console.log("Please provide a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employees last name?",
        validate: (addLast) => {
          if (addLast) {
            return true;
          } else {
            console.log("Please provide a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const params = [answer.firstName, answer.lastName];
      const sqlJob = "SELECT job.id, job.title FROM job";

      db.query(sqlJob, (err, data) => {
        if (err) throw err;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "job",
              message: "What is the employees job?",
              choices: roles,
            },
          ])
          .then((jobChoice) => {
            const job = jobChoice.job;
            params.push(job);
            const managerSql = "SELECT * FROM employee";

            db.query(managerSql, (err, data) => {
              if (err) throw err;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employees manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  const sql =
                    "INSERT INTO employee (first_name, last_name, job_id, manager_id) VALUES (?, ?, ?, ?)";

                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("Employee has been added");
                    showEmployees();
                  });
                });
            });
          });
      });
    });
};

updateJob = () => {
  const employeeSql = `SELECT * FROM employee`;

  db.query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Which employee would you like to update?",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        const jobSql = `SELECT * FROM job`;

        db.query(jobSql, (err, data) => {
          if (err) throw err;

          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "job",
                message: "What is the employee's new job?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const job = roleChoice.job;
              params.push(job);

              let employee = params[0];
              params[0] = job;
              params[1] = employee;

              const sql = `UPDATE employee SET job_id = ? WHERE id = ?`;

              db.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log("Employee has been updated!");

                showEmployees();
              });
            });
        });
      });
  });
};