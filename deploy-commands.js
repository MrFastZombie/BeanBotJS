//const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const dotenv = require('dotenv').config(); // eslint-disable-line no-unused-vars
const dtoken = process.env.DISCORD_TOKEN; // eslint-disable-line no-undef
const guildID = process.env.DISCORD_GUILD_ID; // eslint-disable-line no-undef
const userID = process.env.DISCORD_USER_ID; // eslint-disable-line no-undef
const rest = new REST({ version: '9' }).setToken(dtoken);

var commands = [];

function loadCommands(path) {
    try {
        fs.readdirSync(path).forEach(file => {
            if(file.endsWith('.js')) {
                console.log('Registering ' + file);
                var loadFile = require(path + file);
                commands.push(loadFile.data);
            } else {
                console.warn("Warning: Unrecognized file found in commands folder " + path);
            }
        });
        //db.close();
    } catch (error) {
        console.log(error);
    }
}

(async () => {
    try {
        loadCommands('./commands/fun/');
        loadCommands('./commands/useful/');

        commands = commands.map(command => command.toJSON());
        await rest.put(
            Routes.applicationGuildCommands(userID, guildID),
            {body: commands},
        );

        // eslint-disable-next-line no-undef
        if(process.env.DISCORD_GUILD_ID2 && process.env.DISCORD_GUILD_ID2 !== '') {
            await rest.put(
                // eslint-disable-next-line no-undef
                Routes.applicationGuildCommands(userID, process.env.DISCORD_GUILD_ID2),
                {body: commands},
            );
        }
        console.log("Commands registered.");
    } catch (error) {
        console.log(error);
    }
})();