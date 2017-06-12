# bris-king
Thi is a Node.js application featuring user registration and login. This application was developed using a Node.js, Express.js and Pug templating engine. Also this application requires 
a MongoDB database instance.

How to build?
-------------
Prerequisites: In order to build this application, first, it is required to install NPM, Node.js & MongoDB.

Steps
-----
1. Download the project as a Zip file. This will download a Zip file named bris-king-master.zip.
2. Unzip it.
3. Open a terminal window and navigate to the unzipped folder.
4. Run the command "npm install". This will download the required packages to a folder called node_modules.
5. Now start the MongoDB server.
6. Run the command "npm start" to start the application.
7. Access the application http://localhost:3000/

How to setup MongoDB?
---------------------
1. Install MongoDB
2. Start MongoDB server
3. Start a MongoDB command-line client
4. Type the following commands on MongoDB client prompt to create and test the BrisKing DB.
	1. use BrisKing
	2. db.createCollection('users');
