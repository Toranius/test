const { isEqual } = require("lodash");
const rp = require("request-promise");
const { getCache } = require("./cache.service");

const HIGHLIGHT_CACHE_KEY = "highlight";

function getInvestorHighlights() {
  return rp.get(process.env.INVESTOR_URL, { json: true });
}

function getGlobalHighlights() {
  return rp.get(process.env.GLOBAL_URL, { json: true });
}

async function getMergedHighlights(cache = false) {
  if (cache === true) return getCache().getKey(HIGHLIGHT_CACHE_KEY);

  const investorHighlights = await getInvestorHighlights();
  const globalHighlights = await getGlobalHighlights();

  const highlights = mergeHighlights([investorHighlights, globalHighlights]);
  getCache().setKey(HIGHLIGHT_CACHE_KEY, highlights);

  return highlights;
}

/**
 * This method merges highlights respecting the priority based on
 * order in the array
 *
 * @param {Array of array of highlights} highlightsArray
 */
function mergeHighlights(highlightsArray) {
  const data = {};
  let mergedData = [];

  for (let highlights of highlightsArray) {
    for (let highlight of highlights) {
      if (!data[highlight.name]) data[highlight.name] = [];

      if (data[highlight.name].length >= 10) continue;

      if (data[highlight.name].find(h => isEqual(h, highlight))) continue;

      data[highlight.name].push(highlight);
      mergedData.push(highlight);
    }
  }

  return mergedData;
}

module.exports = {
  getInvestorHighlights,
  getGlobalHighlights,
  getMergedHighlights,
  mergeHighlights
};
