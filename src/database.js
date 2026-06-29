const mongoose = require("mongoose");

// ENV DEV
mongoose.connect("mongodb://database:27017/modyn")
.then(db=>console.log("DB is connected to ", db.connection.host))
.catch(err=>console.error(err));

