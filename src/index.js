const express = require("express");
const app = express();

require("./database");

app.use(express.json());

const { swaggerUi, specs } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
    res.send("Bienvenidos a Modyn E-commerce");
});

app.use(require("./routes/index.routes.js"));

app.listen(3000);
console.log("Server on port ", 3000);