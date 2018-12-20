const express = require("express");

const highlightService = require("../services/highlights.service");

const router = express.Router();

router.get("/", (req, res, next) => {
  const cache = req.query.cache === "true";

  return highlightService
    .getMergedHighlights(cache)
    .then(highlights => {
      res.json({ highlights });
    })
    .catch(error => {
      next(error);
    });
});

exports.highlightsRoutes = router;
