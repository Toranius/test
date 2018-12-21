const cron = require("node-cron");

const highlightService = require("../services/highlights.service");

cron.schedule("* 5 * * *", async () => {
  await highlightService.getMergedHighlights();
});

exports.cron = cron;
