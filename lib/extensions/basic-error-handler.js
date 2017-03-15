'use strict';

module.exports = exports = (client) => {
  client.on('error', e => console.error('Whoops', e));
};
