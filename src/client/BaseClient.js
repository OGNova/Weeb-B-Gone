require('dotenv').config();

const { Client, Collection } = require('discord.js');

const Haste = require('hastebin.js');

const klaw = require('klaw');
const path = require('path');

require('../util/Prototypes');

class WeebBGone extends Client {
  constructor(options) {
    super(options);
    
    this.logger = require('../modules/Logger');

    this.commands = new Collection();
    this.aliases = new Collection();
    this.events = new Collection();

    this.util = {
      haste: new Haste()
    };

    this.wait = require('util').promisify(setTimeout);
  }
}

module.exports = WeebBGone;