const inquirer = require("inquirer");
const db = require("./db/connection");

// Function to start the employee tracker
const startEmployeeTracker = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "prompt",
            message: "Select an action.",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update an employee role",
                "Log Out"
            ]
        }
    ]).then(handleUserChoice);
};

// Function to handle user choices
const handleUserChoice = (answers) => {
    switch (answers.prompt) {
        case "View all departments":
            viewAll("department");
            break;
        case "View all roles":
            viewAll("role");
            break;
        case "View all employees":
            viewAll("employee");
            break;
        case "Add a department":
            addDepartment();
            break;
        case "Add a role":
            addRole();
            break;
        case "Add an employee":
            addEmployee();
            break;
        case "Update an employee role":
            updateEmployeeRole();
            break;
        case "Log Out":
            logOut();
            break;
        default:
            break;
    }
};

// Function to view all records in a table
const viewAll = (tableName) => {
    db.query(`SELECT * FROM ${tableName}`, (err, result) => {
        if (err) throw err;
        console.log(`Viewing all ${tableName}s: `);
        console.table(result);
        startEmployeeTracker();
    });
};

// Function to add a department
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "Enter the name of the department.",
            validate: departmentInput => departmentInput.trim() !== ""
        }
    ]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err) => {
            if (err) throw err;
            console.log(`Added ${answers.department} to the database.`);
            startEmployeeTracker();
        });
    });
};

// Function to add a role
const addRole = () => {
    // Fetch departments from the database
    db.query(`SELECT * FROM department`, (err, departments) => {
        if (err) throw err;

        inquirer.prompt([
            {
                // Adding A Role
                type: "input",
                name: "role",
                message: "Enter the name of the role.",
                validate: roleInput => roleInput.trim() !== ""
            },
            {
                // Adding the Salary
                type: "input",
                name: "salary",
                message: "What is the salary of the role?",
                validate: salaryInput => salaryInput.trim() !== "" && !isNaN(salaryInput)
            },
            {
                // Department
                type: "list",
                name: "department",
                message: "Which department does the role belong to?",
                choices: departments.map(department => department.name)
            }
        ]).then((answers) => {
            // Get the selected department
            const selectedDepartment = departments.find(department => department.name === answers.department);

            // Insert the new role into the database
            db.query(
                `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`,
                [answers.role, answers.salary, selectedDepartment.id],
                (err) => {
                    if (err) throw err;
                    console.log(`Added ${answers.role} to the database.`);
                    startEmployeeTracker();
                }
            );
        });
    });
};

// Function to add an employee
const addEmployee = () => {
    // Fetch roles and managers from the database
    db.query(`SELECT * FROM role`, (err, roles, result) => {
      if (err) throw err;

        inquirer.prompt([
            {
                // Adding Employee First Name
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
                validate: firstNameInput => firstNameInput.trim() !== ""
            },
            {
                // Adding Employee Last Name
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
                validate: lastNameInput => lastNameInput.trim() !== ""
            },
            {
                // Adding Employee Role
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles.map(role => role.title)
            },
            {
                // Adding Employee Manager
                type: "input",
                name: "manager",
                message: "Who is the employee's manager?",
                validate: managerInput => managerInput.trim() !== ""
            }
        ]).then((answers) => {
            // Get the selected role
            const selectedRole = answers.role && result.find(employee => employee.title === answers.role);
            // Get the manager ID
            const managerId = result.find(employee => employee.manager === answers.manager)?.id;
            // Insert the new employee into the database
            // Insert the new employee into the database
            db.query(
              `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`,
              [answers.firstName, answers.lastName, selectedRole ? selectedRole.id : null, managerId],
              (err) => {
                  if (err) throw err;
                  console.log(`Added ${answers.firstName} ${answers.lastName} to the database.`);
                  startEmployeeTracker();
                }
            );
        });
    });
};

// Function to update an employee role
const updateEmployeeRole = () => {
    // Fetch employees and roles from the database
    db.query(`SELECT * FROM employee, role`, (err, result) => {
        if (err) throw err;

        inquirer.prompt([
            {
                // Choose an Employee to Update
                type: "list",
                name: "employee",
                message: "Which employee's role do you want to update?",
                choices: result.map(employee => employee.last_name)
            },
            {
                // Updating the New Role
                type: "list",
                name: "role",
                message: "Enter the name of their new role.",
                choices: result.map(employee => employee.title)
            }
        ]).then((answers) => {
            // Get the selected employee and role
            const selectedEmployee = result.find(employee => employee.last_name === answers.employee);
            const selectedRole = result.find(employee => employee.title === answers.role);

            // Update the employee's role in the database
            db.query(
                `UPDATE employee SET ? WHERE ?`,
                [{ role_id: selectedRole.id }, { last_name: selectedEmployee.last_name }],
                (err) => {
                    if (err) throw err;
                    console.log(`Updated ${answers.employee}'s role in the database.`);
                    startEmployeeTracker();
                }
            );
        });
    });
};

// Function to log out
const logOut = () => {
    db.end();
    console.log("Good-Bye!");
};

// Start the application
db.connect((err) => {
    if (err) throw err;
    console.log("Database connected.");
    startEmployeeTracker();
});
