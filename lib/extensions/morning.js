module.exports = exports = (client, channel, metadata) => {
  return {
    'morning!': (nick) => client.say(channel, `${nick}: morning!`)
  };
};
