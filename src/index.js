const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

const { routes } = require("./routes");
require("./cron");

const app = express();
bodyParser.urlencoded({ extended: true });
app.use(bodyParser.json());

app.use("/api", routes);

app.use((err, req, res, next) => {
  res.status(500);
  res.send("500: Internal server error");
  next();
});

http.createServer(app).listen(process.env.SERVER_PORT);
