const mongoose = require("mongoose");


mongoose.connect("mongodb://localhost:27018/modyn_db")
.then(db=>console.log("DB is connected to ", db.connection.host))
.catch(err=>console.error(err));

