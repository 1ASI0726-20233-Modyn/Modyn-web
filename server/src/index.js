const express = require("express");
const cors = require("cors");

const app = express();

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
require("./database.js");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Bienvenidos a Modyn E-commerce");
});

app.use(require("./routes/index.routes.js"));

app.listen(3000);
console.log("Server on port ", 3000);