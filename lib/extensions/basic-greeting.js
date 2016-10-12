module.exports = exports = (client, channel) => {
  client.on('join', (_, nick) => {
    console.log(`${nick}: morning!`);
  });
};
