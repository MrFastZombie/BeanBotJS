const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const dotenv = require('dotenv').config();
const dtoken = process.env.DISCORD_TOKEN;
const prefix = "beanbot ";
var vbeaning = 0;
const status = [
	"bean snorting simulator",
	"beansusSummon.exe",
	"putting beans in places where beans should not be",
	"spreading beanism",
	"beans"
]

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
    client.user.setActivity('beans', {type: "PLAYING"});
});

client.on('ready', () => { //This block is for changing the status on an interval. Should still work fine if more are added to const status above.
    setInterval(() => {
        const index = Math.floor(Math.random() * (status.length -1) + 1);
        client.user.setActivity(status[index], {type: "PLAYING"});
        console.log('set new status: ' + status[index]);
    }, 600000);
});

client.on('message', async message => { //For commands that either do not work well with commando or would be simpler to put here.
    var mCont = message.content.toLowerCase();

    /*--------------------------------------------------START OF VBEAN--------------------------------------------------*/
    if(mCont.startsWith(prefix + 'vbean')) { //Plays the beaned meme audio in the VC channel the message author is in.
        if(message.member.voice.channel != undefined && vbeaning == 0) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('./data/beaned.mp3');
            vbeaning = 1;
            dispatcher.setVolume(1);
            //setTimeout(function(), 5000);
            await sleep(8000);
            dispatcher.on('finish', () => {
                
            });
            dispatcher.destroy();
            message.guild.me.voice.channel.leave();
            vbeaning = 0
        }
        else {
            message.channel.send('You must be in the VC channel to do this, or I am already vbeaning');
        }
    }
    /*--------------------------------------------------END OF VBEAN--------------------------------------------------*/

    /* -------------------------------------------------START OF GOKU-------------------------------------------------*/
    if(mCont.startsWith(prefix + 'goku')) {
        if(message.member.voice.channel != undefined && vbeaning == 0) {
            const connection = await message.member.voice.channel.join();
            const dispatcher = connection.play('./data/goku.mp3');
            vbeaning = 1;
            dispatcher.setVolume(1);
            //setTimeout(function(), 5000);
            await sleep(10000);
            dispatcher.on('finish', () => {
                
            });
            dispatcher.destroy();
            message.guild.me.voice.channel.leave();
            vbeaning = 0
        }
        else {
            message.channel.send('You must be in the VC channel to do this, or I am already vbeaning');
        }
    }
    /* -------------------------------------------------END OF GOKU-------------------------------------------------*/
    if(mCont.includes('fuck beans')) {
        message.react('🖕');
        return;
    }
})

client.login(dtoken);