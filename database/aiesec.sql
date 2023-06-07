CREATE DATABASE IF NOT EXISTS LC_KANDY

USE LC_KANDY

#Members master table
CREATE TABLE IF NOT EXISTS MEMBERS_MAIN (

    Member_ID       INT(5) AUTO_INCREMENT PRIMARY KEY,
    Full_Name       VARCHAR(100),
    Preferred_Name  VARCHAR(30),
    Function_id     INT(2),
    Dept_id         INT(3),
    Date_of_join    DATE,
    Position_id     INT(3),
    AIESEC_email    VARCHAR(255),
    Personal_email  VARCHAR(255),
    Facebook_link   VARCHAR(255),
    LinkedIN_link   VARCHAR(255),
    Contact_num     VARCHAR(12),
    Gender          CHAR(1),
    Birth_date      DATE,
    Faculty_id      CHAR(2),
    Batch           INT(2),
    UniRegNo        VARCHAR(12),
    School_name     VARCHAR(50),
    Home_address    VARCHAR(100),
    District        VARCHAR(20),
    NIC_Number      INT(12),
    Boarding_addres VARCHAR(100),
    Home_contact    VARCHAR(12),
    Photo_link      VARCHAR(255)

);

#Functions id and name
CREATE TABLE IF NOT EXISTS A_FUNCTION (

    'Name'          VARCHAR(50),
    Abbreviation    VARCHAR(4),
    Func_ID         INT(2) AUTO_INCREMENT PRIMARY Key

);

#Department id and name
CREATE TABLE IF NOT EXISTS DEPARTMENT (

    DName           VARCHAR(25),
    Abbreviation    VARCHAR(10),
    Dept_ID         INT(2) AUTO_INCREMENT PRIMARY Key

);

#Valid pairs 
CREATE TABLE IF NOT EXISTS VALIDPAIRS (

    Func_ID INT(2),
    Dept_ID INT(2),

    FOREIGN KEY (Func_ID) REFERENCES A_FUNCTIONS(Func_ID),
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENTS(Dept_ID)

);