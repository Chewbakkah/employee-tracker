INSERT INTO department (name)
VALUES
    ('design'),
    ('customer service'),
    ('exec');

INSERT INTO roles (title, salary, department_id)
VALUES
    ('dsn-associate', '40000.00', '1'),
    ('dsn-senior', '50000.00', '1'),
    ('dsn-manager', '60000.00', '1'),
    ('cs-associate', '40000.00', '2'),
    ('cs-senior', '50000.00','2'),
    ('cs-manager', '60000.00', '2'),
    ('exec-manager', '90000.00', '5');

INSERT INTO employee (first_name, last_name, role_id, is_manager, manager_id)
VALUES
    ('kim', 'gower', '7', true),
    ('adam', 'ferrera', '3', true, '1'),
    ('keith', 'hoffmeister', '6', true, '1'),
    ('tom', 'haverford', '9', false, '3'),
    ('april', 'ludgate', '12', false, '3'),
    ('cheyne', 'etie', '2', false,'2'),
    ('nick', 'anders', '1', false,'2'),
    ('jared', 'worsham', '4', false, '3'),
    ('caity', 'etie', '5', false, '3');
