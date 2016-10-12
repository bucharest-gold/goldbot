module.exports = exports = (client, channel, metadata) => {
  client.on('join', (_, nick) => {
    console.log(`${nick}: morning!`);
  });
};
