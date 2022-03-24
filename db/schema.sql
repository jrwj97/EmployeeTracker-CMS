DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

CREATE TABLE department (
  id: INT PRIMARY KEY,
  name: VARCHAR(30)
)

CREATE TABLE role (
  id: INT PRIMARY KEY,
  title: VARCHAR(30),
  salary: DECIMAL,
  department_id: INT
  NDEX dep_ind (department_id),
  CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
)

CREATE TABLE employee (
  id: INT PRIMARY KEY,
  first_name: VARCHAR(30),
  last_name: VARCHAR(30),
  role_id: INT,
  manager_id: INT,
  CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE SET NULL,
  INDEX manager_ind (manager_id),
  CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
)