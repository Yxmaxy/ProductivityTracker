CREATE TABLE IF NOT EXISTS GoalGroups (
   id_group INTEGER PRIMARY KEY AUTOINCREMENT,
   name VARCHAR(100),
   color CHAR(7)
);

INSERT INTO GoalGroups(name, color)
VALUES ("Group1", "#FF0000"), ("Group2", "#0000FF");

CREATE TABLE IF NOT EXISTS Frequency (
   id_frequency INTEGER PRIMARY KEY AUTOINCREMENT
);

CREATE TABLE IF NOT EXISTS Goals (
   id_goal INTEGER PRIMARY KEY AUTOINCREMENT,
   name VARCHAR(100),
   id_group INTEGER,
   activity_length INTEGER,
   is_longterm BOOLEAN,
   FOREIGN KEY(id_group) REFERENCES GoalGroups(id_group)
);

INSERT INTO Goals(name)
VALUES ("Goal1"), ("Goal2"), ("Goal2");

CREATE TABLE IF NOT EXISTS SmallerGoals (
   id_smaller_goal INTEGER PRIMARY KEY AUTOINCREMENT,
   name VARCHAR(100),
   id_goal INTEGER,
   FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
);

INSERT INTO SmallerGoals(name, id_goal)
VALUES ("SmallGoal1", 1), ("SmallGoal2", 1), ("SmallGoal3", 1);

CREATE TABLE IF NOT EXISTS GoalFinished (
   id_goal INTEGER,
   date_finished DATE,
   PRIMARY KEY(id_goal, date_finished),
   FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
);

CREATE TABLE IF NOT EXISTS Reminders (
   id_reminder INTEGER PRIMARY KEY AUTOINCREMENT,
   name VARCHAR(100),
   notify_when DATETIME
);

CREATE TABLE GoalYear (
	id_goal INTEGER,
    date DATE,
    num_available_before INTEGER,
    PRIMARY KEY(id_goal, date),
    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
);
INSERT INTO GoalYear
VALUES (1, "2021-12-13"), (1, "2021-12-15");

CREATE TABLE GoalMonth (
	id_goal INTEGER,
    day INTEGER,
    num_available_before INTEGER,
    PRIMARY KEY(id_goal, day),
    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
);

INSERT INTO GoalMonth
VALUES (2, 13), (2, 15);

CREATE TABLE GoalWeek (
	id_goal INTEGER,
    day INTEGER,
    PRIMARY KEY(id_goal, day),
    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
);

INSERT INTO GoalWeek
VALUES (3, 0), (3, 2);

CREATE TABLE GoalCustom (
	id_goal INTEGER,
    first_date DATE,
    num_days_between INTEGER,
    num_available_before INTEGER,
    PRIMARY KEY(id_goal, first_date),
    FOREIGN KEY(id_goal) REFERENCES Goals(id_goal)
);

INSERT INTO GoalCustom
VALUES (3, "2021-12-13", 14), (3, "2021-12-6", 14), (2, "2021-12-5", 14), (2, "2021-12-11", 2);

-- DOBIMO YEAR GOALS OD DANES
SELECT * FROM GoalYearDate WHERE date = CURDATE();
-- DOBIMO MONTH GOALS OD DANES
SELECT * FROM GoalMonthDay WHERE day = DAYOFMONTH(CURDATE());
-- DOBIMO WEEK GOALS OD DANES
SELECT * FROM GoalWeekDay WHERE day = WEEKDAY(CURDATE());
-- DOBIMO FORTNIGHT GOALS OD DANES
SELECT * FROM GoalCustom WHERE (DATEDIFF(CURDATE(), first_date) % num_days_between = 0);