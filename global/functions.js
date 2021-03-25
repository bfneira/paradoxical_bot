const fs = require('fs');
module.exports = (bot, utils, ytdl, config) => {

    fs.readdir("./commands/", (err, files) => {

        if (err) console.error(err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");

        if (jsfiles.length <= 0) return console.log("There are no commands to load...");

        console.log(`Loading ${jsfiles.length} commands...`);
        jsfiles.forEach((f, i) => {
            let props = require(`../commands/${f}`);
            console.log(`${i + 1}: ${f} loaded!`);
            bot.commands.set(props.help.name, props);
            props.help.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
        });
    });

    bot.loadCommand = (commandName) => {
        try {
            let props = require(`../commands/${commandName}`);
            if (props.init) props.init(bot);
            bot.commands.set(commandName, props);
            props.help.aliases.forEach(alias => {
                bot.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (err) {
            return utils.cmd_fail(`Error: ${err}\nCommand \`${commandName}\` cannot be found.`, `${config.prefix}reload <command>`);
        }
    };

    bot.unloadCommand = async (commandName) => {
        try {
            if (!commandName) return `The command \`${commandName}\` doesn"t seem to exist. Try again!`;

            if (commandName.shutdown) await commandName.shutdown(bot);
            delete require.cache[require.resolve(`../commands/${commandName}.js`)];
            return false;
        } catch (err) {
            return utils.cmd_fail(`Error: ${err}\nCommand \`${commandName}\` cannot be found.`, `${config.prefix}reload <command>`);
        }
    };

    bot.handleVideo = async (video, message, vc, playlist = false) => {
        let queue = bot.queue.get(message.guild.id);
        let music = {
            id: video.id,
            title: video.title,
            url: video.url
        };

        if (!queue) {
            let queueConstruct = {
                textChannel: message.channel,
                voiceChannel: vc,
                connection: null,
                musics: [],
                volume: 100,
                playing: true
            };
            let voteConstruct = {
                votes: 0,
                voters: []
            };

            bot.queue.set(message.guild.id, queueConstruct);
            bot.votes.set(message.guild.id, voteConstruct)
            queueConstruct.musics.push(music);

            try {
                var connection = await vc.join();
                queueConstruct.connection = connection;
                bot.play(message.guild, queueConstruct.musics[0]);
            } catch (err) {
                bot.queue.delete(message.guild.id);
                console.error(`I could not join your voice channel: ${err}`);
            }
        } else {
            queue.musics.push(music);
            if (playlist) return;
            else return message.channel.send(`🎵 **${music.title}** has been added to queue`);
        }
        return;
    }

    bot.play = (guild, music) => {
        let queue = bot.queue.get(guild.id);
        let votes = bot.votes.get(guild.id)
        if (!music) {
            queue.voiceChannel.leave();
            bot.queue.delete(guild.id);
            bot.votes.delete(guild.id);
            return queue.textChannel.send(`🎵 Music playback has ended`);
        }

        let dispatcher = queue.connection.play(music.url)
        dispatcher.on('finish', () => {
                queue.musics.shift();
                votes.votes = 0;
                votes.voters = [];
                setTimeout(() => {
                    bot.play(guild, queue.musics[0]);
                }, 1);
            })
       
        dispatcher.on('start', () => {
            queue.textChannel.send(`🎵 **${music.title.replace(".mp3","")}** is now being played`);
            bot.user.setActivity(music.title.replace(".mp3",""), {type: 'LISTENING'})
         });

        dispatcher.setVolumeLogarithmic(queue.volume / 100);
    }

    bot.temascarpeta = (directorio) => {

            var listvideos = [];
            fs.readdirSync(directorio).forEach(file => {
              if((file.indexOf(".mp3") !== -1) && (file.substr(0,2) !== "._"))
                {
                  listvideos.push({id: listvideos.length, title: file, url: directorio + file});
                } else
                {
                  var stat = fs.lstatSync(directorio + file);
                  if(stat.isDirectory()==true)
                  {
                    const fs2 = require('fs');
                    fs2.readdirSync(directorio + file).forEach(filesubcarpeta => {
                        if((filesubcarpeta.indexOf(".mp3") !== -1) && (filesubcarpeta.substr(0,2) !== "._"))
                          {
                            listvideos.push({id: listvideos.length, title: filesubcarpeta, url: directorio + file +"/"+ filesubcarpeta});
                          } else
                          {
                            var stat = fs.lstatSync(directorio + file + "/" + filesubcarpeta);
                            if(stat.isDirectory()==true)
                            {
                                const fs3 = require('fs');
                                fs3.readdirSync(directorio + file + "/" + filesubcarpeta).forEach(filesubsubcarpeta => {
                                    if((filesubsubcarpeta.indexOf(".mp3") !== -1) && (filesubsubcarpeta.substr(0,2) !== "._"))
                                      {
                                        listvideos.push({id: listvideos.length, title: filesubsubcarpeta, url: directorio + file +"/"+ filesubcarpeta +"/" + filesubsubcarpeta});
                                      }
                                  });
                            }
                          }
                      });
                  }
                }
            });
            return listvideos;
          }

}
