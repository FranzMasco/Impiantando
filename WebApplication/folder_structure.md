**index.js**<br />
 The main entry point of the Express application. File on the root, which can be run with Node using node index.js to start the application. It will require the Express app and link up the routes with relative routers.<br />
**app.js**<br />
 Web Application business logic<br />
**middlewares**<br />
 Segregate any middleware needed for the application in one place. There can be middleware for authentication, logging, or any other purpose.<br />
**models**<br />
 Data models required for the application <br />
**public**<br />
 End user front end <br />
**routes**<br />
 Single file for each logical set of route <br />
**configs**<br />
 Keeps all the configs needed for the application