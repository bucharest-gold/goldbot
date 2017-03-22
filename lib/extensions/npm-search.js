'use strict';

const roi = require('roi');

module.exports = exports = (client, channel) => {
  function search (_, __, text) {
    console.log('Looking up', text);
    const options = {
      'endpoint': 'https://www.npmjs.com/-/search?text=' + text
    };

    roi.get(options)
      .then(x => {
        const result = JSON.parse(x.body);
        if (result) {
          const packages = result.objects.map(p => `${p.package.name} --> ${p.package.description}`);
          client.say(channel, `${text}: ${packages.length} package(s) found.`);
          if (packages.length > 3) {
            client.say(channel, `But I'll show only 3.`);
          }
          client.say(channel, packages[0]);
          client.say(channel, packages[1]);
          client.say(channel, packages[2]);
        } else {
          client.say(channel, `Sorry ${text} is a mystery to me`);
        }
      })
      .catch(e => client.say('dammit', e));
  }

  return {
    '.npm': search
  };
};

