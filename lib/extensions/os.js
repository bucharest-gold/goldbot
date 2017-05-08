'use strict';

const os = require('os');

// from: http://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
function toTimeString(seconds) {
  return (new Date(seconds * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
}

module.exports = exports = (client, channel) => {
  function osinfo (_, __, text) {
    client.say(channel, `Host: ${os.hostname()}`);
    client.say(channel, `Uptime: ${toTimeString(os.uptime())}`);
    client.say(channel, `Free mem: ${Math.ceil(os.freemem() / 1024 / 1024)} MB`);
    client.say(channel, `Total mem: ${Math.ceil(os.totalmem() / 1024 / 1024)} MB`);
    client.say(channel, `CPU count: ${os.cpus().length}`);
    client.say(channel, `CPU speed: ${os.cpus()[0].speed}mhz`);
  }

  return {
    '.osinfo': osinfo
  };
};
