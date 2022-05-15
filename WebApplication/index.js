const app = require("./app.js");
const mongoose = require("mongoose");

const port = 5000;
const db_url = "mongodb+srv://impiantando_db_admin:pswdbimpiantando@cluster0.pb11w.mongodb.net/db_test?retryWrites=true&w=majority"

/**CONFIGURE MONGOOSE*/
mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
.then (() => {
    
    console.log("Connected to the Database");
    
    app.listen(port, function() {
        console.log('Server listening on port ', port);
    });
    
})
.catch((err)=>{
    console.error("ERROR: db connection error");
    console.error(err)
});
/**------------------*/