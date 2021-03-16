const Command = require('../../lib/structures/Command');
const { exec } = require('child_process');

class Exec extends Command {
  constructor(client) {
    super(client, {
      name: 'exec',
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) {
    exec(args.join(' '), {}, (err, stdout, stderr) => {
      if (err) return message.channel.send(err.message, { code: 'asciidoc' });
      message.channel.send(stdout, { code: 'asciidoc' });
    });
  }
}

module.exports = Exec;