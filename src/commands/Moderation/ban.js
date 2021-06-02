const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Ban extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const deleteDays = args[1];
    if (deleteDays < 0 || deleteDays > 7) {
      return message.respond('please enter a number between 0 and 7', 'redTick', false);
    }

    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!user) return message.respond('you must mention someone to ban them.', 'redTick', false);
    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.respond('please create a channel called **modlog** and try again.', 'redTick', false);
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(2, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    const logEmbed = new MessageEmbed()
      .setTimestamp()  
      .setColor(0xFF0000)
      .setDescription(`**Action:** Ban \n**Deleted Messages:** ${deleteDays} Days\n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embed: logEmbed });
    member.ban({ days: `${deleteDays}`, reason });
    await this.client.db.createInfraction(caseNum, member.user.id, message.author.id, reason, 'ban', new Date(), true);
  }
}

module.exports = Ban;