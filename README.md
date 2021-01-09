# Case: Boxinator
  * Case Boxinator by Experis Academy.
  * The application is called Sendit.

### About
  The case Boxinator is an web application for shipment delivery service to specific locations around the world. The application is a web application using a
  RESTful API to communicate with a server. The application handles three different types of user: guest, registered user and admin. 
  Users will be able to create accounts to track ongoing and previous shipments. An administrator has access to a portal to change the metadata of the shipping process, 
  this being the countries that can be shipped to and the relative costs of shipping.

## Technical Details
  * Backend: Java (Maven project), Hibernate, Spring Boot, Spring Security
  * Frontend: React, SCSS, CSS Bootstrap and React Bootstrap
  * External service: Firebase Auth and Sendgrid
  
## Hosting At Heroku
  * This web application is deployed to Heroku at: https://boxinator-application.herokuapp.com/

## Installation 

### - Dev enviroment (devbranch)
   Prerequisites: Node.js, Java SDK 14+, PostgreSQL 13, and your preferred IDE, e.g. Intellij, and code editor, e.g. VS Code. 
   
   1. Fork the project to your local machine and run "npm install" while located in the frontend folder. This will install the necessary packages listed in package.json.
   2. Visit Firebase and create a new web project. You will need two config files: one for the backend and the other one for frontend, both will be provided by Firebase.
   * Create a .env file in your frontend folder with the following: 
        * REACT_APP_FIREBASE_API_KEY= {API key here}
          REACT_APP_FIREBASE_AUTH_DOMAIN={Auth domain here}
          REACT_APP_FIREBASE_PROJECT_ID={Project ID here}
 * Download the Firebase SDK for Java and place the "service-account-file.json" in the resources folder (src/main/resources)
 * Signup at Sendgrid to be able to send emails from the application. This is required to implement the GUEST feature. Add the the Sendgrid API key to your enviromental variables as "SENDGRID_API_KEY". Lastly, change the argument in the "from" Email object in "SendgridService" file with the email you have chosen in Sendgrid.
 3. Start the database server.
 4. Start the backend server.
 5. Navigate to the frontend folder and run NPM start. 

### - Prod enviroment (master)
The production differs slightly from the dev enviroment, concerning the backend, in the sense that you need to pass the "service-account-file.json" values from your host, such as Heroku, including the Sendgrid API key and the path do your database. The required values can be found in the application.properties file.

## Usage

 **1. Start page, continue as a guest, register an user or login:**
 
  ![Startpage](https://cdn.discordapp.com/attachments/782896315465203782/797115194714882068/unknown.png)
  
  ---
  
  **2. Place a shipment order as a signed in user:**
  
  ![Place shipment order](https://cdn.discordapp.com/attachments/782896315465203782/797118439499497492/unknown.png)
  
  ---  
    
  **3. The view for a signed in admin:**
  
  ![Admin view](https://cdn.discordapp.com/attachments/782896315465203782/797115865505333278/unknown.png)
  
  ---
  
  **4. Possible to edit all accounts, shipments and shipping countries as an admin:**
  
  ![Edit view](https://cdn.discordapp.com/attachments/782896315465203782/797117338238844938/unknown.png)
  
  ---
  
  **5. Possible to edit your own account as a signed in user or admin:**
  
  ![Edit signed in account](https://cdn.discordapp.com/attachments/782896315465203782/797118913509982228/unknown.png)
  
  ---

## User Manual 
  [User manual for the application](https://github.com/zadama/boxinator-case/tree/master/Boxinator-case%20documents)

### License
[MIT](https://www.oracle.com/downloads/licenses/mit-license.html)

### Authors
  [Aman Zadran](https://github.com/zadama), 
  [Paria Karim](https://github.com/lillap), 
  [Oscar Dahlquist](https://github.com/Vattenkruka), 
  [Ludwig Carlsson](https://github.com/ludwigcarlsson) 

