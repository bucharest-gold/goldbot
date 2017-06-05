'use strict';

const circuitBreaker = require('opossum');
const mavencc = require('mavencc');

function mavenSearch (text, client, channel) {
  return Promise.resolve(mavencc.artifactSearch(text, 3)
    .then(response => {
      const docs = JSON.parse(response.body).response.docs;
      client.say(channel, `${docs.length} items found:`);
      if (docs) {
        docs.forEach((d) => {
          client.say(channel, `artifactId: ${d.a}`);
          client.say(channel, `groupId: ${d.g}`);
          client.say(channel, `latest version: ${d.latestVersion}`);
          client.say(channel, `packaging: ${d.p}`);
          client.say(channel, '----------');
        });
      } else {
        client.say(channel, `Sorry ${text} is a mystery to me`);
      }
    })
    .catch(e => client.say('dammit', e)));
}

const options = {
  timeout: 3000,
  maxFailures: 5,
  resetTimeout: 30000
};
const breaker = circuitBreaker(mavenSearch, options);

module.exports = exports = (client, channel) => {
  function search (_, __, text) {
    console.log('Looking up', text);
    breaker.fire(text, client, channel)
      .then(console.log)
      .catch(console.error);
    breaker.fallback(() => client.say(channel, 'Sorry, search.maven.org is out of service right now.'));
  }

  return {
    '.mvn': search
  };
};
