'use strict';

const roi = require('roi');

module.exports = exports = (client, channel) => {
  function define (_, __, text) {
    console.log('Looking up', text);
    const options = {
      'endpoint': 'http://api.urbandictionary.com/v0/define?term=' + text
    };

    roi.get(options)
      .then(x => {
        const result = JSON.parse(x.body);
        if (result) {
          client.say(channel, `${text}: ${result.list.length} definitions found. Here's the first.`);
          client.say(channel, result.list[0].definition);
          client.say(channel, `Here's an example usage of "${text}".`);
          client.say(channel, result.list[0].example);
        } else {
          client.say(channel, `Sorry ${text} is a mystery to me`);
        }
      })
      .catch(e => client.say('dammit', e));
  }

  return {
    '.define': define
  };
};

