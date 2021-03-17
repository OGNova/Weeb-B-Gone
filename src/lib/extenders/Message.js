const { Structures } = require('discord.js');

const constants = require('../../constants');

module.exports = Structures.extend('Message', Message => class extends Message {
  send(content) {
    this.channel.send(content);
  }

  async commandFail(content, embed, options = {}) {
    if (embed && typeof(embed) !== Boolean) return new Error('Type of embed must be a boolean.');
    this.channel.send(`${this.author}, \`|\`<:redTick:607067960430952459>\`|\` ${content}`, embed);
  }

  async awaitReply(question, filter, limit = 60000, embed) {
    await this.channel.send(question, embed);
    return this.channel.awaitMessages(filter, { max: 1, time: limit, errors: ['time'] })
      .then(collected => collected.first().content)
      .catch(() => false);
  }
});