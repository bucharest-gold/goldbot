module.exports = exports = (client, channel) => {
  client.on('error', e => console.error('Whoops', e));
};
