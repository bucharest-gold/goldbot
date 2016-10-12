module.exports = exports = (client, channel, metadata) => {
  return {
    'night!': (nick) => client.say(channel, `${nick}: laters!`)
  };
};
