# GoldBot
A simple IRC Bot written in Node.js. There are a few builtin things this bot can
do, like execute some Javascript or look up some slangy thing in urban dictionary.

## Installation
Install globally if that's your thing.

    $ npm install -g goldbot

## Usage
You can run goldbot from the command line. If you don't like the default values,
you can change them by putting them in a JSON file, and telling goldbot about
the file.

    $ cat bot-config.json
    {
      "channel": "#my-fave-channel"
    }
    $ goldbot bot-config.json
    Reading configuration goldbot.json
    Using configuration
    { channel: '#my-fave-channel' }
    12 Oct 14:20:31 - Sending irc NICK/USER
    12 Oct 14:20:31 - SEND: NICK bgoldbot
    12 Oct 14:20:31 - SEND: USER bgoldbot 8 * bucharest-gold/goldbot
    12 Oct 14:20:31 - SEND: JOIN #my-fave-channel

The configuration options available and their default values in parentheses
are shown below.

* `server` (`irc.freenode.net`): The IRC server the bot should connect to.
* `channel` (`#bucharest-gold`): The channel the bot should join.
*  `userName` (`bgoldbot`): The username for the bot.
*  `botNick` (`bgoldbot`): The nick for the bot.
*  `realName` (`bucharest-gold/goldbot`): The real name of the bot (whatever that means).

## Extensions
By default `goldbot` commes with some basic functionality. It can say hi when you joint,
or goodbe whe you part, give you some helpful hints, look up slang for you in urban
dictionary, and most importantly, allow you to execute arbitrary Javascript. To see
everything that goldbot can do, type the hep command.

    [16:41:33]  <lanceball>	bgoldbot: .help
    [16:41:33]  <bgoldbot>	lanceball: morning!
    [16:41:33]  <bgoldbot>	There is an ecmascript context I created just for you!
    [16:41:33]  <bgoldbot>	You can run regular ecmascript by simply prefixing
    [16:41:33]  <bgoldbot>	a line with '>> '
    [16:41:33]  <bgoldbot>	Try it with some simple JS and see what happens!
    [16:41:34]  <bgoldbot>	If you get your context into terrible shape,
    [16:41:34]  <bgoldbot>	you can reset it by sending me the .clear command.
    [16:41:35]  <bgoldbot>	To send a command, just prefix with my nick.
    [16:41:35]  <bgoldbot>	E.g, to clear your context type 'bgoldbot: .clear'
    [16:41:36]  <bgoldbot>	Available commands: .clear, .help, .define

### Custom Extensions
If this isn't enough for you, you can make goldbot do what you want by writing a
simple extension. An extension is a function that you write which is executed by
goldbot. At execution time, it is given direct access to the IRC client itself
and also to the channel that the client is connected to.

This allows extensions to add event listeners to the client, and perform some
action as a result of the action.

Extension functions may optionally return an object which commands to actions.
A command is any word, or text surrounded by white space.

There's a lot to digest here, let's look at a simple function and break it down.

Here's a module that will say hello to everyone joining the channel, and exports
the command, '.say-hello'. It uses the client that is provided on initialization
to set up the event listener for the `join` event. And since `channel` is captured
in the function closure, we can use that and the client to create a commmand
that responds to `.hello`.

    const GoldBot = require('goldbot');
    const bot = GoldBot.bot({
      channel: '#echoChamber'
    });
    bot.use((client, channel) => {
      client.on('join', (_, nick) => console.log(`${nick}: morning!`));
      return {
        '.hello': (from, to, params) => client.say(channel, `Hey, ${from}!`);
      }
    });

Execute this command in IRC by asking goldbot to do it for you.

    [17:12:54]  <lanceball>	bgoldbot: .hello
    [17:12:55]  <bgoldbot>	Hey, lanceball!

Command functions will receive three parameters.

  * `from`: the nick of the user who executed the command
  * `to`: the recipient of the command. This is almost always the channel name.
  * `params`: any text (whitespace trimmed) that appears after the command name.

Here's a simple echo extension. As you can see, it will just echo whatever
value follows the command.

    bot.use((client, channel) => {
      '.echo': (frm, to, params) => client.say(channel, `${frm}: ${params}`)
    });

And here's how it's used.

    [17:19:48]  <lanceball>	bgoldbot: .echo hug tcrawley
    [17:20:09]  <bgoldbot>	lanceball: hug tcrawley

## Testing Your Extensions

Of course, you should write unit tests and all of that. But often, it's great
just to see wtf is happening in real life when you run the bot. Let's say you
are writing a new extension, and want to test it out on an IRC server for
realsies, without actually committing/pushing/publishing your changes. Here's
what you need to do.

First clone the repository and use `npm link` to trick your system into
using your development/testing version of the repository.

    $ git clone https://github.com/bucharest-gold/goldbot
    $ cd goldbot
  	$ npm link

In a new terminal in a temp directory write a config file that specifies
a channel you want to use.

    $ cd test-goldbot
    $ cat > bot-config.json
    {
      "channel": "#my-fave-channel"
    }
    ^C

That's the channel you're going to test in. Start the bot `$ goldbot bot-config.json`,
then play around and see what appears in the terminal. See what appears in IRC.
Then make changes, e.g. remove this line https://github.com/bucharest-gold/goldbot/blob/master/lib/extensions/urban-dictionary.js#L12.
Restart bot and see what happens.