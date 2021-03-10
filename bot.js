const {CommandoClient} = require('discord.js-commando');
const sqlite = require('sqlite3').verbose();
const schedule = require('node-schedule');
const ytpl = require('ytpl'); 
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

async function updateDumbList() {
    try {
        console.log("Updating dumb video list...");
        let db = new sqlite.Database('./data/beanbot.db', sqlite.OPEN_READWRITE  | sqlite.OPEN_CREATE);
        var playlist = await ytpl('PLQeJEVxxxHONLgyIEGITtvbndh3Mf5Aaz', {limit: Infinity});
        var idList = new Array();
        let playlistSize = playlist.items.length;
        for(let i = 0; i < playlistSize; i++) {idList.push(playlist.items[i].id);}
        db.run('DELETE FROM dumbvideos');
        let insert = idList.map((idList) => '(?)').join(','); //Creates a insertion string for SQL that can handle each element in the idList. Example: (?),(?),(?),(?),...,(?) (basically for n elements)
        db.run('INSERT INTO dumbvideos(videoID) VALUES ' + insert, idList);
        db.close();
        console.log("Dumb video list updated.")
    }
    catch(err) {
        console.error(err);
    }
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
    let db = new sqlite.Database('./data/beanbot.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
    db.run('CREATE TABLE IF NOT EXISTS dumbvideos(videoID TEXT NOT NULL)');
    db.close();
    const updateList = schedule.scheduleJob('* 0 * * *', function() {
        updateDumbList();
    });
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