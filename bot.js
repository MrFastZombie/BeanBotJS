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
        client.user.setActivity(status[index], {type: "PLAYING"}); //Note: Custom status is a type option, but it does not work. :(
        console.log('set new status: ' + status[index]);
    }, 600000);
});

client.on('message', async message => { //For commands that either do not work well with commando or would be simpler to put here.
    var mCont = message.content.toLowerCase();
    if(mCont.includes('fuck beans')) {
        message.react('🖕');
        return;
    }
})

client.login(dtoken);