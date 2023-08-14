## General

[ ] Porting project to typescript
[ ] JWT refresh tokens
[ ] Allow console logging only in debugging by creating a global variable called "DEBUG" and replacing "console.log()" statements to "DEBUG && console.log()"

## Frontend

[ ] Global data store for data such as genders etc.

### Components

- [ ] Global Notifications: Currently each data view page contains a snackbar which is used to display notifications

  - [ ] Create a global snackbar that can be used to display notifications with a notify() function that accepts a notification object {severity:"", message: ""}
  - [ ] Handle displaying multiple notifications at once
  - [ ] Default notification object to avoid undefined value renderings
  - [ ] Unit Testing

- [ ] Tables

  - [ ] Pagination

- [ ] Create Reusable Skeletons
  - [ ] Profile Card
  - [ ] Table
  - [ ] Form

### API

- [ ] Handling form submissions by seperate crud service modules: Currently all form submissions are handled inside the page component itself which creates conflict of interests
  - [ ] Add JWT token during the creation of the axios object
  - [ ] Use global notifications
  - [ ] Currently the isLoading state variable of a form accepts a boolean value, convert it into a string so load fail state can also be set using this variable
    - [ ] success: api call was successfull
    - [ ] fail: api call was unsuccessfull
    - [ ] loading: api call is still in progress
    - [ ] cancel: api call halted (Add this state only if neccessary)

### Forms

- [ ] Better textfield integration with formik

## Backend

[ ] Handle empty row returns from sql calls otherwise the map functions will break
