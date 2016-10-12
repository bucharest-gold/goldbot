const irc = require('irc');

const defaults = {
  server: 'irc.freenode.net',
  channel: '#bucharest-gold',
  userName: 'bgoldbot',
  botNick: 'bgoldbot',
  realName: 'bucharest-gold/goldbot',
  autoConnect: false
};

function bot (options) {
  const channel = options.channel;
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

  client.use = function use (extension) {
    Object.assign(commands, extension);
  };

  const builtinExtensions = [
    './extensions/es5',
    './extensions/basic-greeting',
    './extensions/basic-error-handler',
    './extensions/morning',
    './extensions/night',
    './extensions/urban-dictionary'
  ];

  builtinExtensions.map((ext) => {
    const extension = require(ext);
    client.use(extension(client, channel, metadata));
  });

  client.connect(5, (input) => {
    // we could have been assigned another nick
    options.botNick = input.args[0];
    botNick = options.botNick;
    const commandRegEx = new RegExp(`${botNick}:\\s*(\\.?\\w+!?)\\W*(.*)`);

    client.on('message', (frm, to, text) => {
      if (text.startsWith(`${botNick}:`)) {
        // It's a command. Let's see what it is
        const result = text.match(commandRegEx);
        console.log('commandRegEx', commandRegEx);
        console.log('result', result);

        if (result === null) {
          console.log('Unable to execute command', text);
          sorry(frm, text);
        } else if (commands[result[1]]) {
          commands[result[1]](frm, to, result[2]);
        } else {
          console.log('No idea how to execute', text);
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

  function sorry (nick, cmd) {
    client.say(channel, `Really sorry about this, ${nick}, but that's just not possible.`);
    client.say(channel, `I just don't know squat about '${cmd}'`);
    client.say(channel, `Maybe you can check the google: https://google.com?q=${cmd}`);
  }
}

bot.defaults = defaults;

module.exports = exports = bot;
