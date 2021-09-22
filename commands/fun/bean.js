const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
module.exports = {
    data: new SlashCommandBuilder()
            .setName('bean')
            .setDescription("Bean someone!")
            .addUserOption(option => 
                option.setName('target')
                .setDescription('The user to bean')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('message')
                .setDescription('Optional message to send to the target user.')
                .setRequired(false)),
    async execute(interaction) {
        const beanedImg = new MessageAttachment('./data/images/beaned.png', 'beaned.png');
        const unoImg = new MessageAttachment('./data/images/uno.png', 'uno.png');
        var user = interaction.options.getUser('target');
        const message = interaction.options.getString('message');

        try {
            var reply = "They just got beaned."

            if(user.id == '674022563621634069') {
                reply = {content: "I AM THE ONE WHO BEANS", files: [unoImg]};
                user = interaction.user;
            } 

            user.send({content: 'beaned', files: [beanedImg]}).catch(err => {console.log(err.message); reply = 'Failed to bean that user. :(';});
            if(message) user.send(message).catch(err => console.log(err.message));
            await interaction.reply(reply);
        } catch (error) {
            console.error(error);
        }
    }
}