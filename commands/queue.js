const discord = require('discord.js');
const utils = require('../global/utils');

module.exports.run = async (bot, message, args) => {

    
    try
    {
    let queue = bot.queue.get(message.guild.id);
    if (!queue) return [message.delete(), utils.timed_msg('⚠ Lista de reprodución vacia.', 5000)];

    var texto = `**-=- Paradoxical radio -=-** \n\n**__Now Playing:__**\n${queue.musics[0].title.replace(".mp3","")} \n\n**__Up Next:__**\n${(queue.musics.map(music => `**-**  ${music.id} - ${music.title.replace(".mp3","")}`).slice(1,20)).join('\n')} \n\n${queue.musics.length} temas en total en la lista\n\n`;
  
    //var array = queue.musics.map();

    let embed = new discord.MessageEmbed()
        .setColor('#FFF033')
        .setThumbnail(bot.user.avatarURL)
        .setDescription(texto)
        .setTimestamp()
        .setFooter('Page 1/' + Math.ceil(queue.musics.length / 20), bot.user.avatarURL());

        message.channel.send(embed);

    } catch (err) {
        message.channel.send(utils.cmd_fail(`Error: ${err}`));
    }
   

};

module.exports.help = {
    name: 'queue',
    aliases: ['list', 'musiclist', 'songlist']
}
