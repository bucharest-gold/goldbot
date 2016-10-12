#!/usr/bin/env node

'use strict';

const fs = require('fs');
const GoldBot = require(`${__dirname}/index.js`);

let options = GoldBot.defaults;

const configFile = process.argv[2];
if (configFile) {
  try {
    console.log(`Reading configuration ${configFile}`);
    const config = JSON.parse(fs.readFileSync(configFile).toString());
    console.log('Using configuration');
    console.log(config);
    Object.assign(options, config);
  } catch (e) {
    console.error('Unable to read configuration json.', e);
    console.error(e.stack);
    process.exit();
  }
}
GoldBot.bot(options).connect();
