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
    run(message) {
        async function main() {
            const sfile = path.join(__dirname, '../../data/goku.mp3');
            //const connection = await message.
        }
        main();
    }
};