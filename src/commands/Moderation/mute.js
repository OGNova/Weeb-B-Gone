const Command = require('../../lib/structures/Command');
const { parseUser } = require('../../modules/parseUser');
const { caseNumber } = require('../../modules/caseNumber');

const { MessageEmbed } = require('discord.js');

class Mute extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      permLevel: 'Moderator'
    });
  }

  async run(message, args) {
    let action;
    let embedColor;

    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!user) return message.respond('you must mention someone to mute them.', 'redTick', false);
    parseUser(message, user);

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.respond('please create a channel called **modlog** and try again.', 'redTick', false);
    const caseNum = await caseNumber(this.client, modlog);

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.respond('please create a role called **Muted** and try again.', 'redTick', false);


    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;
  

    if (member._roles.includes(muteRole.id)) {
      action = 'Unmute';
      embedColor = '0x00AE86';
    } else {
      action = 'Mute';
      embedColor = '0xFFFF00';
    }

    const logEmbed = new MessageEmbed()
      .setTimestamp()  
      .setColor(embedColor)
      .setDescription(`**Action:** ${action} \n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embed: logEmbed });
    
    if (member._roles.includes(muteRole.id)) {
      member.roles.remove(muteRole);
    } else {
      member.roles.add(muteRole);
    }
    await this.client.db.createInfraction(caseNum, member.user.id, message.author.id, reason, 'mute', new Date(), true);
  }
}

module.exports = Mute;