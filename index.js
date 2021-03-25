const discord = require('discord.js');
const ytdl = require('ytdl-core');
const ready = require('./handlers/ready');
const message = require('./handlers/message');
const config = require('./settings/config.json');
const utils = require('./global/utils');
const bot = new discord.Client();

require('./global/functions')(bot, utils, ytdl, config);

bot.commands = new discord.Collection();
bot.aliases = new discord.Collection();
bot.queue = new Map() // Music Queue
bot.votes = new Map(); // Vote Skip

ready.ready(bot);
message.message(bot, utils, config, discord);
