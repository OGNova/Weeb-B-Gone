const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Kick extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!user) return message.respond('you must mention someone to kick them.', 'redTick', false);
    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.respond('please create a channel called **modlog** and try again.', 'redTick', false);
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(2, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    const logEmbed = new MessageEmbed()
      .setTimestamp()  
      .setColor(0xFFA500)
      .setDescription(`**Action:** Kick\n**Deleted Messages:** ${deleteDays} Days\n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embed: logEmbed });
    member.kick(reason);
  }
}

module.exports = Kick;