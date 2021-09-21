const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = new SlashCommandBuilder()
    .setName('commandtesting')
    .setDescription("This is a testing of commands");
