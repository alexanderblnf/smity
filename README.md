# SMity
### This is the official SMity github repo


# Instructions
  1. Install [nodeJS](https://nodejs.org/en/)
  2. Install [postgreSQL](https://www.postgresql.org/download/) and create a new database. *pgAdmin* is recommended (it's included in the installation)
  3. Execute from terminal *npm install* in working directory
  4. Modify *config/database.js* and put your own database name and password
  5. Start server using *nodemon server.js* . The server will restart every time you save a file in the project.
  
# Functionalities
+ Basic functional login and signup pages
+ Basic profile page
+ Filtered uRad services (see *app/uradRoutes.js*)
+ Basic LiveObjects services (*work in progress*)

# Todo
+ Add to package.json: follow-redirects and nodemon 
+ Change server path