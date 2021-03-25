const utils = require('../global/utils');
const config = require('../settings/config.json');

module.exports.run = async (bot, message, args) => {

    let queue = bot.queue.get(message.guild.id);
    let votes = bot.votes.get(message.guild.id);

    if (!queue) return [message.delete(), utils.timed_msg('⚠ Lista de reprodución vacia.', 5000)];

    if (!message.member.hasPermission('ADMINISTRATOR')) {
   
      if (votes.voters.includes(message.author.id)) return [message.delete(), utils.timed_msg(utils.cmd_fail(`⚠ ${message.author}, you have already voted! **${votes.votes}/3** votes`, `${config.prefix}skip`), 5000)];
      votes.votes++
      votes.voters.push(message.author.id);
      message.channel.send(`🎵 ${message.author}, you have voted to skip! **${votes.votes}/2** votes`);

      if (votes.votes > 1) return queue.connection.dispatcher.end();
      } else return queue.connection.dispatcher.end();

};

module.exports.help = {
    name: 'skip',
    aliases: ['next']
};
