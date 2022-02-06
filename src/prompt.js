const inquirer = require("inquirer");
const db = require("../config/connection");

const promptUser = () => {
  return inquirer
    .prompt([
      {
        type: "list",
        message: "Choose an option.",
        name: "action",
        choices: [
          "View all Departments",
          "View all Roles",
          "View all Employees",
          "Add a Department",
          "Add a Role",
          "Add an Employee",
          "Update an Employee Role",
          "EXIT",
        ],
      },
    ])
    .then(function (answer) {
      switch (answer.action) {
        case "View all Departments":
          viewDept();
          break;

        case "View all Roles":
          viewRoles();
          break;

        case "View all Employees":
          viewEmployee();
          break;

        case "Add a Department":
          addDept();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "Update an Employee Role":
          updateEmp();
          break;

        case "EXIT":
          console.log("Thanks for using Employee Tracker!");
          process.exit();
      }
    });
};

const viewDept = () => {
  const sql = `SELECT * FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

const viewRoles = () => {
  const sql = `SELECT r.id, r.title, r.salary, d.dept_name FROM roles AS r JOIN department AS d ON d.id = r.department_id ORDER BY r.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

const viewEmployee = () => {
  const sql = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, e.manager_id, d.dept_name FROM employee AS e JOIN roles AS r ON r.id = e.role_id JOIN department AS d ON d.id = r.department_id ORDER BY e.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    promptUser();
  });
};

const addDept = () => {
  return inquirer
    .prompt([
      {
        type: "input",
        name: "dept",
        message: "What is the name of the department you would like to add?",
      },
    ])
    .then(function (answer) {
      const sql = `INSERT INTO department (dept_name) VALUES ('${answer}')`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const addRole = () => {
  let deptChoice = [];
  let dept = `SELECT * FROM department`;
  db.query(dept, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      deptChoice.push(rows);
    }

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role you would like to add?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "input",
          name: "department_id",
          message: "Which department does this role belong to?",
          choices: deptChoice,
        },
      ])
      .then((answer) => {
        const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${answer.department_id}')`;
        db.query(sql, (err, rows) => {
          if (err) {
            console.log(err);
            return err;
          }
          promptUser();
        });
      });
  });
};

module.exports = promptUser;
