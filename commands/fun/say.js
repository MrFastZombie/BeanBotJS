const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars

module.exports = {
    data: new SlashCommandBuilder()
            .setName('say')
            .setDescription('Make beanbot say something :)')
            .addStringOption(option =>
                option.setName('input')
                .setDescription('The thing I will say :)')
                .setRequired(true)),
    async execute(interaction) {

        try {
            interaction.reply(interaction.options.getString('input'));
        } catch (error) {
            console.error(error);
        }
    }
}