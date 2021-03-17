const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Unban extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    const userID = args[0];
    
    if (!userID) return message.respond('you must mention someone to unban them.', 'redTick', false);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.respond('please create a channel called **modlog** and try again.', 'redTick', false);
    const caseNum = await caseNumber(this.client, modlog);

    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;

    message.guild.members.unban(userID).then(user => {
      const logEmbed = new MessageEmbed()
        .setTimestamp()  
        .setColor(0x00AE86)
        .setDescription(`**Action:** Unban\n**Target:** ${user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
        .setFooter(`Case ${caseNum}`);

      this.client.channels.cache.get(modlog.id).send({ embed: logEmbed });
    });
  }
}

module.exports = Unban;