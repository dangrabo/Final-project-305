CREATE DATABASE tasks;

USE tasks;

DROP TABLE IF EXISTS submissions;

CREATE TABLE submissions (
	id INT auto_increment,
    dateStarted DATE,
    dateDue DATE,
    title VARCHAR(255),
    description VARCHAR(255),
    priority VARCHAR(255),
    completed BOOLEAN,
    deleted BOOLEAN,

    
    PRIMARY KEY (id)
)