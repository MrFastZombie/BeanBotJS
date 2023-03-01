const { SlashCommandBuilder } = require('@discordjs/builders');
const  { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { MessageAttachment } = require('discord.js');
const magik = require('../../data/beanlib/magik.js');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('magik')
            .setDescription('Use beanbot to edit photos with ImageMagick.')
            .addStringOption(option =>
                option.setName('image')
                .setDescription('URL of the image to edit.')
                .setRequired(true)),
    async execute(interaction) {
        //Note: Most of the code for this command is within data/beanlib/magik.js
        try {
            var image = await interaction.options.getString('image');
            let test = await magik.meme('This is a test :)', 'bottom text', image);
            let result = new MessageAttachment(test, 'magik.png');

            await interaction.reply({files: [result]});
            magik.delImage(test);
        } catch (error) {
            console.error(error);
        }
    }
}