const BaseClient = require('./src/client/BaseClient');
const init = require('./src/client/Init');
const createLogger = require('./src/client/GlobalLogger');

const myIntents = ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"];

const client = new BaseClient({
  fetchAllMembers: true,
  partials: ['MESSAGE', 'CHANNEL'],
  ws: { intents: myIntents }
});
global.bot = client;

init(client, process.env.PROD_TOKEN).catch(e => console.log(e));
createLogger(client);
