const { Client } = require('pg');
const chalk = require('chalk');

var connection = new Client({
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD
});

module.exports.connect = function() {
  console.log(chalk`{bold.green DEBUG:} Opening connection to database.`);
  connection.connect();
  this.query(
    'CREATE TABLE IF NOT EXISTS guilds ( \
      "id" BIGSERIAL PRIMARY KEY,          \
      "name" TEXT,                         \
      "owner" BIGSERIAL,                   \
      );'
  );

  this.query(
    'CREATE TABLE IF NOT EXISTS members ( \
      "id" BIGSERIAL PRIMARY KEY,           \
      "name" TEXT                           \
      );'
  );

  console.log(chalk`{bold.green DEBUG:} Done. Starting bot.`);
};

// Server Related Queries

module.exports.addServer = function(id, name, owner) {
  const addServerQuery = {
    text: 'INSERT INTO guilds (id, name, owner) ' +
          'VALUES ($1, $2, $3)',
    values: [id, name, owner]
  };
  return connection.query(addServerQuery);
};
  
  
module.exports.removeServer = function(id) {
  const removeServerQuery = {
    text: 'DELETE FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(removeServerQuery);
};
  
  
module.exports.getServer = function(id) {
  const getServerQuery = {
    text: 'SELECT * FROM guilds WHERE id = $1',
    values: [id]
  };
  return connection.query(getServerQuery);
};


// Member Related Queries

module.exports.addMember = function(id, name) {
  const addMemberQuery = {
    text: 'INSERT INTO members (id, name) ' +
          'VALUES ($1, $2)',
    values: [id, name]
  };
  return connection.query(addMemberQuery);
};


// Helper Queries

module.exports.query = function(rawSQL) {
  const rawQuery = {
    text: rawSQL
  };
  return connection.query(rawQuery);
};