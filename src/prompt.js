const inquirer = require("inquirer");
const db = require("../config/connection");
let deptChoice = [];
let roleChoice = [];
let mgrChoice = [];
let empChoice = [];

const chooseDept = function () {
  deptChoice = [];
  let dept = `SELECT * FROM department`;
  db.query(dept, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var deptList = rows[i].dept_name;
        deptChoice.push(deptList);
      }
    }
  });
};

const chooseRole = function () {
  roleChoice = [];
  let role = `SELECT title FROM roles`;
  db.query(role, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var roleList = rows[i].title;
        roleChoice.push(roleList);
      }
    }
  });
};

const chooseMgr = function () {
  mgrChoice = [];
  let mgr = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee WHERE is_manager = 1 ORDER BY id`;
  db.query(mgr, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var mgrList = rows[i].name;
        mgrChoice.push(mgrList);
      }
    }
  });
};

const chooseEmp = function () {
  empChoice = [];
  let emp = `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee ORDER BY id`;
  db.query(emp, (err, rows) => {
    if (err) {
      console.log(err);
      return err;
    } else {
      for (var i = 0; i < rows.length; i++) {
        var empList = rows[i].name;
        empChoice.push(empList);
      }
    }
  });
};

const promptUser = () => {
  chooseEmp();
  chooseRole();
  chooseMgr();
  chooseDept();
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
          "View Manager's Employees",
          "View Department Employees",
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

        case "View Manager's Employees":
          viewMgrEmp();
          break;

          case "View Department Employees":
            viewDeptEmp();
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
      const sql = `INSERT INTO department (dept_name) VALUES ('${answer.dept}')`;
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
        type: "rawlist",
        name: "department_id",
        message: "Which department does this role belong to?",
        choices: deptChoice,
      },
    ])
    .then((answer) => {
      let chosenDept;
      for (var i = 0; i < deptChoice.length; i++) {
        if (deptChoice[i] === answer.department_id) {
          chosenDept = i + 1;
        }
      }

      const sql = `INSERT INTO roles (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', '${chosenDept}')`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const addEmployee = () => {
  //   chooseRole();
  //   chooseMgr();
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter employee's last name:",
      },
      {
        type: "rawlist",
        name: "role_id",
        message: "Select employee role:",
        choices: roleChoice,
      },
      {
        type: "rawlist",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: mgrChoice,
      },
      {
        type: "confirm",
        name: "is_manager",
        message: "Is this person a manager?",
        default: false,
      },
    ])
    .then((answer) => {
      let chosenRole;
      for (var i = 0; i < roleChoice.length; i++) {
        if (roleChoice[i] === answer.role_id) {
          chosenRole = i + 1;
        }
      }
      let chosenMgr;
      for (var i = 0; i < mgrChoice.length; i++) {
        if (mgrChoice[i] === answer.manager_id) {
          chosenMgr = i + 1;
        }
      }
      let chosenIs_manager;
      if (answer.is_manager == false) {
        chosenIs_manager = 0;
      } else {
        chosenIs_manager = 1;
      }

      const sql = `INSERT INTO employee (first_name, last_name, role_id, is_manager, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', '${chosenRole}', '${chosenIs_manager}', '${chosenMgr}')`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const updateEmp = () => {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "id",
        message: "Choose Employee To Update",
        choices: empChoice,
      },
      {
        type: "input",
        name: "first_name",
        message: "Enter employee's first name:",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter employee's last name:",
      },
      {
        type: "rawlist",
        name: "role_id",
        message: "Select employee role",
        choices: roleChoice,
      },
      {
        type: "rawlist",
        name: "manager_id",
        message: "Who is the employee's manager?",
        choices: mgrChoice,
      },
      {
        type: "confirm",
        name: "is_manager",
        message: "Is this person a manager?",
        default: false,
      },
    ])
    .then((answer) => {
      let chosenEmp;
      for (var i = 0; i < empChoice.length; i++) {
        if (empChoice[i] === answer.id) {
          chosenEmp = i + 1;
        }
      }
      let chosenRole;
      for (var i = 0; i < roleChoice.length; i++) {
        if (roleChoice[i] === answer.role_id) {
          chosenRole = i + 1;
        }
      }
      let chosenMgr;
      for (var i = 0; i < mgrChoice.length; i++) {
        if (mgrChoice[i] === answer.manager_id) {
          chosenMgr = i + 1;
        }
      }
      let chosenIs_manager;
      if (answer.is_manager == false) {
        chosenIs_manager = 0;
      } else {
        chosenIs_manager = 1;
      }

      const sql = `UPDATE employee SET first_name = '${answer.first_name}', last_name = '${answer.last_name}', role_id = '${chosenRole}', is_manager = '${chosenIs_manager}', manager_id = '${chosenMgr}' WHERE id = '${chosenEmp}'`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return err;
        }
        promptUser();
      });
    });
};

const viewMgrEmp = () => {
  inquirer
    .prompt([
      {
        type: "rawlist",
        name: "id",
        message: "Choose Manager to View Team:",
        choices: mgrChoice,
      },
    ])
    .then((answer) => {
      let chosenMgr;
      for (var i = 0; i < mgrChoice.length; i++) {
        if (mgrChoice[i] === answer.id) {
          chosenMgr = i + 1;
        }
      }

      const sql = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.dept_name FROM employee AS e JOIN roles AS r ON r.id = e.role_id JOIN department AS d ON d.id = r.department_id WHERE manager_id = '${chosenMgr}'`;
      db.query(sql, (err, rows) => {
        if (err) {
          console.log(err);
          return;
        }
        console.table(rows);
        promptUser();
      });
    });
};

const viewDeptEmp = () => {
    inquirer
      .prompt([
        {
          type: "rawlist",
          name: "id",
          message: "Choose Department to View Team:",
          choices: deptChoice,
        },
      ])
      .then((answer) => {
        let chosenDept;
        for (var i = 0; i < deptChoice.length; i++) {
          if (deptChoice[i] === answer.id) {
            chosenDept = i + 1;
          }
        }
  
        const sql = `SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.dept_name FROM employee AS e JOIN roles AS r ON r.id = e.role_id JOIN department AS d ON d.id = r.department_id WHERE department_id = '${chosenDept}'`;
        db.query(sql, (err, rows) => {
          if (err) {
            console.log(err);
            return;
          }
          console.table(rows);
          promptUser();
        });
      });
  };

module.exports = promptUser;
