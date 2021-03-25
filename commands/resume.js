const utils = require('../global/utils');

module.exports.run = async (bot, message, args) => {

     
    if (!message.member.hasPermission('ADMINISTRATOR')) return utils.timed_msg(utils.no_perm(`${message.author}, No tienes permiso para ejecutar este comando!`), 5000)


    let queue = bot.queue.get(message.guild.id);
    
    if (queue && !queue.playing) {
        queue.playing = true;
        queue.connection.dispatcher.resume();
        return message.channel.send(`🎵 Sigamos con la musica`);
    }

    return [message.delete(), utils.timed_msg('⚠ Lista de reprodución vacia.', 5000)];
    
};

module.exports.help = {
    name: 'resume',
    aliases: []
};