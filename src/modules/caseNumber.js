async function caseNumber(client, modChannel) {
  const messages = await modChannel.messages.fetch({ limit: 5 });
  const log = messages.filter(m => m.author.id === client.user.id &&
      m.embeds[0] &&
      m.embeds[0].type === 'rich' &&
      m.embeds[0].footer &&
      m.embeds[0].footer.text.startsWith('Case')
  ).first();
  if (!log) return '1';
  const thisCase = /Case\s(\d+)/.exec(log.embeds[0].footer.text);
  return thisCase ? parseInt(thisCase[1]) + 1 :1;
}

module.exports = { caseNumber };