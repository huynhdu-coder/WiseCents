INSERT INTO users (first_name, last_name, email, password)
VALUES ('Koen', 'Daviduk', 'koen@wisecents.com', 'hashedpassword'),
       ('Jeremy', 'Dunn', 'jeremy@wisecents.com', 'hashedpassword');

INSERT INTO goals (user_id, name, target_amount)
VALUES (1, 'Emergency Savings', 5000.00),
       (1, 'Travel Fund', 1500.00),
       (2, 'New Laptop', 1200.00);

INSERT INTO transactions (user_id, name, category, amount)
VALUES (1, 'Groceries', 'Food', 120.45),
       (1, 'Gym Membership', 'Health', 45.00),
       (2, 'Coffee', 'Dining', 6.50);


SELECT * FROM users;
SELECT * FROM goals;
SELECT * FROM transactions;
