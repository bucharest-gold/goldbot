'use strict';

module.exports = exports = (client, channel) => {
  return {
    'morning!': (nick) => client.say(channel, `${nick}: morning!`)
  };
};
