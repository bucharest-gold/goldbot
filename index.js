'use strict';

const bot = require('./lib/bot');

const GoldBot = {
  bot,
  get defaults () {
    // always return a fresh copy of the defaults
    // so they can't be modified in user land
    return Object.assign({}, bot.defaults);
  }
};

module.exports = exports = GoldBot;
