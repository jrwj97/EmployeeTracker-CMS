INSERT INTO department (name)
VALUES
("IT"),
("Finance & Accounting"),
("Sales & Marketing"),
("Operations");

INSERT INTO job (title, salary, department_id)
VALUES
("Full Stack Developer", 80000, 1),
("Software Engineer", 120000, 1),
("Accountant", 10000, 2), 
("Finanical Analyst", 150000, 2),
("Marketing Coordindator", 70000, 3), 
("Sales Lead", 90000, 3),
("Project Manager", 100000, 4),
("Operations Manager", 90000, 4);


INSERT INTO employee (first_name, last_name, job_id, manager_id)
VALUES 
("Dwight", "Johnson", 2, null),
("Bill", "Burkhart", 1, 1),
("Gloria", "Nicholson", 4, null),
("Sherly", "Oliver", 3, 3),
("Zoey", "Whalburg", 6, null),
("Mike", "Daniels", 5, 5),
("Harry", "Osbourn", 7, null),
("Peter", "Parker", 8, 7);