const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const sqlite = require('sqlite3').verbose();
const dotenv = require('dotenv').config();

module.exports = class DumbCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dumb',
            group: 'fun',
            memberName: 'dumb',
            description: 'Posts a random dumb video.',
            examples: ['beanbot dumb']
        });
    } //End of Constructor(client)

    async run(message) {
        let db = new sqlite.Database('./data/beanbot.db', sqlite.OPEN_READWRITE  | sqlite.OPEN_CREATE);
        db.get("SELECT * FROM dumbvideos ORDER BY RANDOM() LIMIT 1", (err, result) => {
            if(err) {
                console.err(err);
            }
            else {
                message.say("https://www.youtube.com/watch?v="+result.videoID);
            }
        });
        db.close();
    }

} //End of module.exports