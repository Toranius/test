const express = require("express");

const { highlightsRoutes } = require("./highlights");

const router = express.Router();

router.use("/highlights", highlightsRoutes);

exports.routes = router;
