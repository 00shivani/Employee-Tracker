-- Inserts names of departments into department table
INSERT INTO department
  (name)
VALUES
  ('Design'),
  ('Sales'),
  ('Engineering'),
  ('Legal');

-- Inserts roles of employee into role table
INSERT INTO role
  (title, salary, department_id)
VALUES
  ('Lead Designer', 60000, 1),
  ('The Boss', 1000000, 2),
  ('Lead Engineer', 80000, 3),
  ('Accountant', 70000, 4);

-- Inserts employee information into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Acid', 'Betty', 1, NULL),
  ('Mike', 'Tyson', 2, 3),
  ('Shivani', 'Singh', 3, 1),
  ('Ru', 'Paul', 4, NULL);
