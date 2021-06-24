require("dotenv").config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP

const express = require("express");
const mysql = require("mysql");

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

const app = express();

app.get("/", (req, res) => {
  res.send("Hi! ;)");
});

app.get("/:creation_uri", (req, res) => {
  let sql;
  if (req.params.creation_uri === "guestbook") {
    sql = "SELECT * FROM guestbook WHERE creations_id = 0 ORDER BY date DESC";
  } else {
    sql = `SELECT guestbook.* FROM creations, guestbook WHERE creations.id = guestbook.creations_id AND creations.uri LIKE '${req.params.creation_uri}' ORDER BY date DESC`;
  }
  // const sql = "SELECT * FROM creations";
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});
// Listen on pc port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));

