const DiscordJS = require('discord.js');
const {performance} = require('perf_hooks');
const sqlite = require('sqlite3').verbose();
const schedule = require('node-schedule');
const ytpl = require('ytpl'); 
const ms = require('ms');
const path = require('path'); // eslint-disable-line no-unused-vars
const dotenv = require('dotenv').config(); // eslint-disable-line no-unused-vars
const dtoken = process.env.DISCORD_TOKEN; // eslint-disable-line no-undef
const fs = require('fs');
const status = [
	"bean snorting simulator",
	"beansusSummon.exe",
	"putting beans in places where beans should not be",
	"spreading beanism",
	"beans"
]

const client = new DiscordJS.Client({
    intents: [DiscordJS.Intents.FLAGS.GUILDS, DiscordJS.Intents.FLAGS.GUILD_MESSAGES, DiscordJS.Intents.FLAGS.GUILD_VOICE_STATES],
});

client.commands = new DiscordJS.Collection();
const commandFiles = fs.readdirSync('./commands/fun').filter(file => (file.endsWith('.js') || file.endsWith('.ts'))).concat(fs.readdirSync('./commands/useful').filter(file => (file.endsWith('.js') || file.endsWith('.ts'))));

for(const file of commandFiles) { //Loads the command files from the commands folder.
    var command;
    if(fs.existsSync('./commands/fun/' + file)) {
        command = require('./commands/fun/' + file);
    } else if (fs.existsSync('./commands/useful/' + file)) {
        command = require('./commands/useful/' + file);
    } else {console.warn('WARNING: File ' + file + ' not found in command folders.');}
    client.commands.set(command.data.name, command);
}

async function updateDumbList() { //Updates the list of videos from the YouTube Playlist for the Dumb videos command.
    try {
        var t1 = performance.now();
        console.log("Updating dumb video list...");
        let db = new sqlite.Database('./data/beanbot.db', sqlite.OPEN_READWRITE  | sqlite.OPEN_CREATE);
        var playlist = await ytpl('PLQeJEVxxxHONLgyIEGITtvbndh3Mf5Aaz', {limit: Infinity});
        var idList = new Array();
        let playlistSize = playlist.items.length;

        for(let i = 0; i < playlistSize; i++) {idList.push(playlist.items[i].id);} //Store each video ID in an array. 
        db.run('DELETE FROM dumbvideos'); //Clears the table to start anew. Probably not great for speed, but works for now. 
        // eslint-disable-next-line no-unused-vars
        let insert = idList.map((idList) => '(?)').join(','); //Creates a insertion string for SQL that can handle each element in the idList. Example: (?),(?),(?),(?),...,(?) (basically for n elements)
        db.run('INSERT INTO dumbvideos(videoID) VALUES ' + insert, idList);
        db.close();
        var t2 = performance.now();
        console.log("Dumb video list updated. Took " + ms(t2-t1) + ".");
    }
    catch(err) {
        console.error(err);
    }
}

client.once('ready', () => {
    console.log('Logged in')
    client.user.setActivity('beans', {type: "PLAYING"});
    let db = new sqlite.Database('./data/beanbot.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE); //Create the database if it does not exist. 
        db.run('CREATE TABLE IF NOT EXISTS dumbvideos(videoID TEXT NOT NULL)');
        db.close();

    //Below: Update the dumb video list at midnight every night. 
    const updateList = schedule.scheduleJob('0 0 * * *', function() { // eslint-disable-line no-unused-vars
        updateDumbList();
    });
});

client.on('ready', () => { //This block is for changing the status on an interval. Should still work fine if more are added to const status above.
    setInterval(() => {
        const index = Math.floor(Math.random() * (status.length -1) + 1);
        client.user.setActivity(status[index], {type: "PLAYING"});
        console.log('set new status: ' + status[index]);
    }, 600000);
});

client.on('messageCreate', async message => { //For commands that either do not work well with commando or would be simpler to put here.
    var mCont = message.content.toLowerCase();
    if(mCont.includes('fuck beans')) {
        message.react('🖕');
        return;
    }
})

client.on('interactionCreate', async interaction => { //This block runs any commands that are called on Discord which are in seperate command files.
    if(!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: 'There was an error executing this command :(', ephemeral: true});
    }
})

client.login(dtoken);