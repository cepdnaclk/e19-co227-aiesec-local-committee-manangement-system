const express = require("express");
const router = express.Router();

const { execQuery } = require("../../database/database");
const uploadImage = require("../../middleware/imageUpload");

router.get("/badges", (req, res, next) => {
  execQuery("SELECT * FROM badge;")
    .then((rows) => {
      // console.log(rows[1][0]);
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/badges/:id", (req, res, next) => {
  execQuery(`SELECT * FROM badge WHERE id='${req.params.id}';`)
    .then((rows) => {
      // console.log(rows[1][0]);
      res.status(200).send(rows[0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/badges", uploadImage.single("file"), (req, res, next) => {
  // console.log(req);

  const image = req.file.filename;
  execQuery(
    `INSERT INTO badge (name, image) VALUES ('${req.body.name}', '${image}');
    SELECT * FROM badge WHERE id=(SELECT MAX(id) FROM badge);`
  )
    .then((rows) => {
      // console.log(rows[1][0]);
      res.status(200).send(rows[1][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.put("/badges/:id", (req, res, next) => {
  execQuery(`UPDATE badge SET name='${req.body.name}' WHERE id=${req.params.id};
    SELECT * FROM badge WHERE id='${req.params.id}';`)
    .then((rows) => {
      res.status(200).json(rows[1][0]);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/badges/:id", (req, res, next) => {
  execQuery(`DELETE FROM badge WHERE id='${req.params.id}';`)
    .then((rows) => {
      res.status(200).json({ message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/achievements/:memberId", (req, res, next) => {
  execQuery(
    `SELECT * FROM MemberAchievements WHERE memberId='${req.params.memberId}';`
  )
    .then((rows) => {
      // console.log(rows[1][0]);
      res.status(200).send(rows);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/achievements/:memberId/:badgeId", (req, res, next) => {
  execQuery(
    `INSERT INTO achievement (memberId, badgeId) VALUES ('${req.params.memberId}', '${req.params.badgeId}');`
  )
    .then((rows) => {
      res.status(200).json({ message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/achievements/:memberId/:badgeId", (req, res, next) => {
  execQuery(
    `DELETE FROM achievement WHERE memberId='${req.params.memberId}'  AND badgeId='${req.params.badgeId}';`
  )
    .then((rows) => {
      res.status(200).json({ message: "Ok" });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
