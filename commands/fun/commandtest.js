const { SlashCommandBuilder } = require('@discordjs/builders');
module.exports = {
    data: new SlashCommandBuilder()
            .setName('commandtesting')
            .setDescription("This is a testing of commands"),
    async execute(interaction) {
        await interaction.reply('pong');
    }
}