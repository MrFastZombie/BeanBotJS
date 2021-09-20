const { Command } = require('discord.js-commando');
const DiscordJS = require('discord.js')
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const opusscript = require('@discordjs/opus');

module.exports = class VBeanCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'vbean',
            group: 'fun',
            memberName: 'vbean',
            description: 'Plays a bean voice clip in the message authors current voice chat room.',
            examples: ['beanbot vbean']
        });
    }
    async run(message) {
        const sfile = path.join(__dirname, '../../data/beaned.mp3');
        if(message.member.voice.channel != undefined) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(fs.createReadStream(sfile));
            dispatcher.on('finish', () => {
                if(message.guild.me.voice.channel != undefined) {
                    message.guild.me.voice.channel.leave();
                }
                dispatcher.destroy();
            });
            dispatcher.on('error', console.error);
        }
    }
};