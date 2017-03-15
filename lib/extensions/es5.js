'use strict';

const vm = require('vm');

const contexts = {};

module.exports = exports = function es5bot (client, channel, metadata) {
  metadata.contexts = contexts;
  // add listeners to the client so we can manage
  // our cache of execution contexts.
  client.on('names', (_, names) => {
    for (let nick in names) {
      console.log('Creating new context for', nick);
      contexts[nick] = newContext();
    }
  });

  client.on('join', (_, nick) => {
    console.log('Creating new context for', nick);
    contexts[nick] = newContext();
  });

  client.on('part', (_, nick) => {
    delete contexts[nick];
    client.say(channel, `Bye, ${nick}. Your JS context has been destroyed.`);
  });

  client.on('message', (frm, to, text) => {
    if (text.startsWith('>>')) {
      execScript(frm, text.substring(2).trim());
    }
  });

  function execScript (user, text) {
    try {
      const script = new vm.Script(text);
      const result = script.runInContext(metadata.contexts[user].context,
        {
          displayErrors: true,
          timeout: 5000
        }
      );
      client.say(channel, `${result}`);
    } catch (e) {
      console.error(e);
      client.say(channel, `${e}`);
    }
  }

  function clear (nick) {
    client.say(channel, `Resetting context for ${nick}`);
    contexts[nick] = newContext();
  }

  function help (nick) {
    if (nick !== metadata.options.botNick) {
      contexts[nick] = newContext();
      client.say(channel, `${nick}: morning!`);
      client.say(channel, 'There is an ecmascript context I created just for you!');
      client.say(channel, 'You can run regular ecmascript by simply prefixing');
      client.say(channel, 'a line with \'>> \'');
      client.say(channel, 'Try it with some simple JS and see what happens!');
      client.say(channel, 'If you get your context into terrible shape,');
      client.say(channel, 'you can reset it by sending me the .clear command.');
      client.say(channel, 'To send a command, just prefix with my nick.');
      client.say(channel, `E.g, to clear your context type '${metadata.options.botNick}: .clear'`);
      client.say(channel, 'Available commands: .clear, .help, .define');
    }
  }

  return {
    '.clear': clear,
    '.help': help
  };
};

function newContext () {
  let sandbox = {};
  sandbox.global = sandbox;
  sandbox.Buffer = Buffer;
  let context = vm.createContext(sandbox);
  return {sandbox, context};
}

