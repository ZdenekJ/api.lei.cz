require("dotenv").config(); // ALLOWS ENVIRONMENT VARIABLES TO BE SET ON PROCESS.ENV SHOULD BE AT TOP

const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

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
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hi! ;)");
});

app.get("/:creation_uri/:page?/:posts_per_page?", (req, res) => {
  let sql,
    params,
    page,
    postsPerPage,
    maxPostPerPage = parseInt(process.env.MAX_POST_PER_PAGE, 10);
  page = parseInt(req.params.page, 10) || 0;
  postsPerPage =
    parseInt(req.params.posts_per_page, 10) ||
    parseInt(process.env.DEF_POST_PER_PAGE, 10);
  postsPerPage = postsPerPage < maxPostPerPage ? postsPerPage : maxPostPerPage;

  sqlCount =
    "SELECT COUNT(*) as postsCount FROM creations, guestbook WHERE creations.id = guestbook.creations_id AND creations.uri = ?";
  sql =
    "SELECT guestbook.* FROM creations, guestbook WHERE creations.id = guestbook.creations_id AND creations.uri = ? ORDER BY date DESC LIMIT ? OFFSET ?";
  params = [req.params.creation_uri, postsPerPage, page * postsPerPage];

  db.query(sqlCount, params, (err, results) => {
    if (err) {
      throw err;
    }
    const pagesCount = Math.ceil(results[0].postsCount / postsPerPage);

    db.query(sql, params, (err, results) => {
      if (err) {
        throw err;
      }
      const data = {
        postsPerPage: postsPerPage,
        page: page,
        pagesCount: pagesCount,
        posts: results,
      };
      res.json(data);
    });
  });
});

// Listen on pc port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
