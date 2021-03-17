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


    const user = message.mentions.users.first();
    const member = message.guild.member(user);

    if (!user) return message.commandFail('you must mention someone to mute them.', false)
    parseUser(message, user)

    const modlog = message.guild.channels.cache.find(channel =>  channel.name === 'modlog');
    if (!modlog) return message.commandFail('please create a channel called **modlog** and try again.', false);
    const caseNum = await caseNumber(this.client, modlog);

    const muteRole = message.guild.roles.cache.find(role => role.name === 'Muted');
    if (!muteRole) return message.commandFail('please create a role called **Muted** and try again.', false)


    const reason = args.splice(1, args.length).join(' ') || `Awaiting moderator input. Use **__reason ${caseNum} <reason>**.`;
  

    if (member._roles.includes(muteRole.id)) {
      action = 'Unmute'
    } else {
      action = 'Mute'
    }

    const logEmbed = new MessageEmbed()
    .setTimestamp()  
    .setColor(0x00AE86)
    .setDescription(`**Action:** ${action} \n**Target:** ${member.user.username}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
    .setFooter(`Case ${caseNum}`);

    this.client.channels.cache.get(modlog.id).send({ embed: logEmbed });
    
    if (member._roles.includes(muteRole.id)) {
      member.roles.remove(muteRole);
    } else {
      member.roles.add(muteRole);
    }
  }
}

module.exports = Mute;