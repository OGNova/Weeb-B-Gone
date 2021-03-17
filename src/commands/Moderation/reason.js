async function embedSan(embed) {
  embed.message ? delete embed.message : null;
  embed.footer ? delete embed.footer.embed : null;
  embed.provider ? delete embed.provider.embed : null;
  embed.thumbnail ? delete embed.thumbnail.embed : null;
  embed.image ? delete embed.image.embed : null;
  embed.author ? delete embed.author.embed : null;
  embed.fields ? embed.fields.forEach(f => {delete f.embed;}) : null;
  return embed;
}

const Command = require('../../lib/structures/Command');

class Reason extends Command {
  constructor(client) {
    super(client, {
      name: 'reason',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const modlog = message.guild.channels.cache.find(channel => channel.name === 'modlog');
    const caseNum = args.shift();
    const newReason = args.join(' ');

    await modlog.messages.fetch({ limit: 100 }).then((messages) => {
      const caseLog = messages.filter(m => m.author.id === this.client.user.id &&
        m.embeds[0] &&
        m.embeds[0].type === 'rich' &&
        m.embeds[0].footer &&
        m.embeds[0].footer.text.startsWith('Case') &&
        m.embeds[0].footer.text === `Case ${caseNum}`    
      ).first();
      modlog.messages.fetch(caseLog.id).then(logMsg => {
        const embed = logMsg;
        embedSan(embed);
        embed.description = embed.description.replace(`Awaiting moderator's input. Use __reason ${caseNumber} <reason>.`, newReason);
        logMsg.edit({embed});
      });
    });
  }
}

module.exports = Reason;