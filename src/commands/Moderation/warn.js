const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Warn extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!user) return message.respond('you must mention someone to warn them.', 'redTick', false);
    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.respond('please create a channel called **modlog** and try again.', 'redTick', false);
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    const logEmbed = new MessageEmbed()
      .setTimestamp()  
      .setColor(0xFF9E00)
      .setDescription(`**Action:** Warning \n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embed: logEmbed });

    await this.client.db.createInfraction(caseNum, member.user.id, message.author.id, reason, 'warning', new Date(), true);
  }
}

module.exports = Warn;