'use strict';

const irc = require('irc');
const Fidelity = require('fidelity');

const defaults = {
  server: 'irc.freenode.net',
  channel: '#bucharest-gold',
  userName: 'bgoldbot',
  botNick: 'bgoldbot',
  realName: 'bucharest-gold/goldbot',
  autoConnect: false
};

const builtinExtensions = [
  './extensions/es5',
  './extensions/basic-greeting',
  './extensions/basic-error-handler',
  './extensions/morning',
  './extensions/night',
  './extensions/urban-dictionary',
  './extensions/npm-search'
];

function bot (options) {
  // for now, only support a single channel
  const channel = options.channel;
  // extensions can use this to stash shared data
  const metadata = { options };

  // this could change when we actually connect
  let botNick = options.botNick;
  let commands = {};

  const client = new irc.Client(options.server, options.botNick, {
    autoConnect: options.autoConnect,
    userName: options.userName,
    realName: options.realName,
    channels: [options.channel],
    debug: true
  });

  client.use =
    (extension) => Object.assign(commands, extension(client, channel, metadata));

  builtinExtensions.map((ext) => client.use(require(ext)));

  bot.connect = () => {
    const connected = Fidelity.deferred();
    client.connect(5, (input) => {
      // connected
      connected.resolve();

      // we could have been assigned another nick
      botNick = adjustNick(input.args[0]);
      let commandRegEx = new RegExp(`${botNick}:\\s*(\\.?\\w+!?)\\W*(.*)`);
      client.on('nick', (oldNick, newNick) => {
        if (oldNick === botNick) botNick = adjustNick(newNick);
        commandRegEx = new RegExp(`${botNick}:\\s*(\\.?\\w+!?)\\W*(.*)`);
      });

      client.on('message', (frm, to, text) => {
        if (text.startsWith(`${botNick}:`)) {
          // It's a command. Let's see what it is
          const result = text.match(commandRegEx);

          if (result === null) {
            console.log('Unable to execute command', text);
            sorry(frm, text);
          } else if (commands[result[1]]) {
            commands[result[1]](frm, to, result[2]);
          } else {
            console.log('No idea how to execute', text);
            console.log(result);
            sorry(frm, result[1]);
          }
        }
      });

      client.join(channel, (input) => {
        console.log(`Joined ${channel}.`);
        client.say(channel, 'morning!');
        client.say(channel, `Type '${botNick}: .help' to ask what I can do`);
      });
    });
    return connected.promise;
  };

  function adjustNick (newNick) {
    options.botNick = newNick;
    return options.botNick;
  }

  function sorry (nick, cmd) {
    client.say(channel, '/me shrugs');
    client.say(channel, `Really sorry about this, ${nick}, but you stumped me.`);
    client.say(channel, `Maybe you can check the google: https://google.com?q=${cmd}`);
  }

  return bot;
}

bot.defaults = defaults;

module.exports = exports = bot;
