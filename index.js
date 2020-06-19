const BaseClient = require('./src/client/BaseClient');
const init = require('./src/client/Init');
const createLogger = require('./src/client/GlobalLogger');

const client = new BaseClient({
  fetchAllMembers: true,
  partials: ['MESSAGE', 'CHANNEL']
});
global.bot = client;

init(client, process.env.PROD_TOKEN, true, true).catch(e => console.log(e));
createLogger(client);
