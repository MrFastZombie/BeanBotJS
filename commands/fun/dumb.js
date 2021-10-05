const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const sqlite = require('sqlite3').verbose();

module.exports = {
    data: new SlashCommandBuilder()
            .setName('dumb')
            .setDescription('BeanBot will post a random dumb video'),
    async execute(interaction) {

        try {
            let db = new sqlite.Database('./data/beanbot.db', sqlite.OPEN_READWRITE  | sqlite.OPEN_CREATE);
            db.get("SELECT * FROM dumbvideos ORDER BY RANDOM() LIMIT 1", (err, result) => {
                if(err) {
                    console.err(err);
                }
                else {
                    interaction.reply("https://www.youtube.com/watch?v="+result.videoID);
                }
            });
            db.close();
        } catch (error) {
            console.error(error);
        }
    }
}