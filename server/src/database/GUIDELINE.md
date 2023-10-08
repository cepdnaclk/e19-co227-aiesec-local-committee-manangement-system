Naming Conventions
Adapted from: https://github.com/RootSoft/Database-Naming-Convention
tables, views, columns
=> singular
=> lowercase
=> seperated by \_ (snake_case)
=> AVOID QUOTED IDENTIFIERS ("date", "First Name")
=> full words, no abbreviations unless they are common (like id)
=> no reserved words
primary keys
=> single column primary key fields should be named id
foreign keys
=> should be a combination of the name of the referenced table and the name of the referenced fields
