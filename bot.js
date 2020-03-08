const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const dotenv = require('dotenv').config();
const dtoken = process.env.DISCORD_TOKEN;
const prefix = "beanbot ";

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


const client = new CommandoClient({
    commandPrefix: 'beanbot ',
    owner: '197406355026345994',
    invite: '',
    disableEveryone: true,
    unknownCommandResponse: false,
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun', 'fun commands'],
        ['useful', 'useful commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands')); //registers commands in BeanBotJS/commands


client.once('ready', () => {
    console.log('Logged in')
});

client.on('message', async message => { //For commands that either do not work well with commando or would be simpler to put here.
    var mCont = message.content.toLowerCase();

    /*--------------------------------------------------START OF VBEAN--------------------------------------------------*/
    if(mCont.startsWith(prefix + 'vbean')) { //Plays the beaned meme audio in the VC channel the message author is in.
        if(message.member.voiceChannel != undefined) {
            const connection = await message.member.voiceChannel.join();
            const dispatcher = connection.playFile('./data/beaned.mp3');
            dispatcher.setVolume(1);
            //setTimeout(function(), 5000);
            await sleep(10000);
            dispatcher.on('finish', () => {
                
            });
            dispatcher.destroy();
            message.guild.me.voiceChannel.leave();
        }
        else {
            message.channel.send('You must be in the VC channel to do this.');
        }
    }
    /*--------------------------------------------------END OF VBEAN--------------------------------------------------*/
})

client.login(dtoken);