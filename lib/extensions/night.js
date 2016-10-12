module.exports = exports = (client, channel) => {
  return {
    'night!': (nick) => client.say(channel, `${nick}: laters!`)
  };
};
