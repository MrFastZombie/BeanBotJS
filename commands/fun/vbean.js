const { Command } = require('discord.js-commando');
const DiscordJS = require('discord.js')
const fs = require('fs');
const path = require('path');
const ffmpeg = require('ffmpeg-static');
const opusscript = require('@discordjs/opus');

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

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
    run(message) {
        async function main() {
            const sfile = path.join(__dirname, '../../data/beaned.mp3');
            //const connection = await message.
        }
        main();
    }
};