const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27018/modyn_db")
.then(db => console.log("DB is connected to ", db.connection.host))
.catch(err => console.error(err));