const roi = require('roi');

module.exports = exports = (client, channel, metadata) => {
  function define (_, __, text) {
    console.log('Looking up', text);
    const options = {
      'endpoint': 'http://api.urbandictionary.com/v0/define?term=' + text
    };

    roi.get(options)
      // TODO: why do we need to next tick here?!
      .then(x => x)
      .then(x => {
        const result = JSON.parse(x.body);
        if (result.list.length > 0) {
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

