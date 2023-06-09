CREATE DATABASE IF NOT EXISTS LC_KANDY

USE LC_KANDY

#Members master table
CREATE TABLE IF NOT EXISTS MEMBERS_MAIN (

    Member_ID       INT(5) AUTO_INCREMENT PRIMARY KEY,

    #login details
    Personal_email  VARCHAR(255) UNIQUE NOT NULL,
    User_password   VARCHAR(20)  NOT NULL,

    #member details
    Full_Name       VARCHAR(100),
    Preferred_Name  VARCHAR(30),
    Function_id     INT(2),
    Dept_id         INT(3),
    Date_of_join    DATE,
    Position_id     INT(3),
    Contact_num     VARCHAR(12),
    AIESEC_email    VARCHAR(255),
    Gender          CHAR(1),
    NIC_Number      INT(12),
    Birth_date      DATE,
    Facebook_link   VARCHAR(255),
    LinkedIN_link   VARCHAR(255),
    Instagram_link  VARCHAR(255),
    Faculty_id      CHAR(2),
    Batch           INT(2),
    UniRegNo        VARCHAR(12) UNIQUE, #try to implement auto filling relevant fields when registering
    School_name     VARCHAR(50),
    Home_address    VARCHAR(100),
    Home_contact    VARCHAR(12),
    District        VARCHAR(20),
    Photo_link      VARCHAR(255),
    Boarding_address VARCHAR(100)

);

#Functions id and name
CREATE TABLE IF NOT EXISTS A_FUNCTION (

    'Name'          VARCHAR(50),
    Abbreviation    VARCHAR(4),
    Func_ID         INT(2) AUTO_INCREMENT PRIMARY Key

);

#Department id and name
CREATE TABLE IF NOT EXISTS DEPARTMENT (

    Dept_ID         INT(2) AUTO_INCREMENT PRIMARY Key,
    DName           VARCHAR(25),
    Abbreviation    VARCHAR(10)

);

#Valid pairs of Functions - Departments
CREATE TABLE IF NOT EXISTS VALIDPAIRS (

    Func_ID INT(2),
    Dept_ID INT(2),

    FOREIGN KEY (Func_ID) REFERENCES A_FUNCTIONS(Func_ID),
    FOREIGN KEY (Dept_ID) REFERENCES DEPARTMENTS(Dept_ID)

);
# new term details must be added manually at the start of every new term (hardcoding)
CREATE TABLE IF NOT EXISTS TERMS (

    Term_id                 INT(3) AUTO_INCREMENT PRIMARY KEY,
    Term_name               VARCHAR(10), #Only Summer or winter
    T_Year                  INT,    #T_Year and Term_name creates the full name of the term

    Start_date              DATE,
    End_date                DATE,
    Newbie_Recruitment_date DATE

);

### TEAMS TABLE

# iGV Data Tables

/* CREATE TABLE IF NOT EXISTS IGV_PROJECTS (

    Opportunity_id          INT(),
) */