const utils = require('../global/utils');
const config = require('../settings/config.json');


module.exports.run = async (bot, message, args) => {
    
try
{
  if (!message.member.hasPermission('ADMINISTRATOR')) return utils.timed_msg(utils.no_perm(`${message.author}, No tienes permiso para ejecutar este comando!`), 5000)


    let VC = bot.channels.cache.get("798688829694410793");
    let url ='';


     const testFolder = config.DirMusica;
        
      
        var videos = [];
        let IntTema = 0;

        videos = bot.temascarpeta(testFolder)

      for (const vid of Object.values(videos)) {
            let video = {
              id: vid.id,
              title: vid.title,
              url: vid.url
            };
            await bot.handleVideo(video, message, VC,true)
       }

      } catch (err) {
        message.channel.send(utils.cmd_fail(`Error: ${err}`));
    }
};

module.exports.help = {
    name: 'play',
    aliases: ['join']
};

