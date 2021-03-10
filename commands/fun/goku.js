const { Command } = require('discord.js-commando');
const DiscordJS = require('discord.js')
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const opusscript = require('@discordjs/opus');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class GokuCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'goku',
            group: 'fun',
            memberName: 'goku',
            description: 'summons goku into your voice channel',
            examples: ['beanbot goku']
        });
    }
    async run(message) {
        const sfile = path.join(__dirname, '../../data/goku.mp3');
        if(message.member.voice.channel != undefined) {
            console.log("");
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play(sfile);
            await sleep(8000);
            dispatcher.on('finish', () => {
                
            });
            dispatcher.destroy();
            if(message.guild.me.voice.channel != undefined) {
                message.guild.me.voice.channel.leave();
            }
        }
    }
};