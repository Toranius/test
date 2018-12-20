const flatCache = require("flat-cache");

const cache = flatCache.load("app");

exports.getCache = () => cache;

exports.clear = () => flatCache.clearAll();
