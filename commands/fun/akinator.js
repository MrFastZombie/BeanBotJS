const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'); // eslint-disable-line no-unused-vars
const { Aki } = require('aki-api');

async function createMessage(akin) {
    var progress = akin.progress;
    var embed = new MessageEmbed().setColor('#0099ff').setTitle('Akinator');
    var output = {embeds: [embed], components: []};

    var yesButton = new MessageButton().setCustomId('yes').setLabel('Yes').setStyle('PRIMARY');
    var noButton = new MessageButton().setCustomId('no').setLabel('No').setStyle('PRIMARY');
    var dkButton = new MessageButton().setCustomId('dk').setLabel('Don\'t know').setStyle('PRIMARY');
    var probablyButton = new MessageButton().setCustomId('prob').setLabel('Probably').setStyle('PRIMARY');
    var pnButton = new MessageButton().setCustomId('probn').setLabel('Probably not').setStyle('PRIMARY');
    var backButton = new MessageButton().setCustomId('back').setLabel('Back').setStyle('SECONDARY');
    var winYes = new MessageButton().setCustomId('winyes').setLabel('Yes').setStyle('PRIMARY');
    var winNo = new MessageButton().setCustomId('winno').setLabel('No').setStyle('PRIMARY');

    var playActionRow = new MessageActionRow().addComponents([yesButton, noButton, dkButton, probablyButton, pnButton]);
    var playBackRow = new MessageActionRow().addComponents([backButton]);
    var winActionRow = new MessageActionRow().addComponents([winYes, winNo]);

    if(progress >= 90) {
        await akin.win();
        var img = akin.answers[0].absolute_picture_path;
        embed.setTitle('Akinator: Is this who you were thinking of?');
        embed.addFields(
            {name: 'Name', value: akin.answers[0].name},
            {name: 'Description', value: akin.answers[0].description}
        );
        embed.setImage(img);
        output['components'].push(winActionRow);
    } else if (akin.currentStep >= 50) {
        embed.setTitle('Akinator: You win!');
    } else {
        embed.addFields(
            {name: 'Question', value: akin.question}
        );
        embed.setFooter('Current step: ' + (akin.currentStep + 1));
        output['components'].push(playActionRow);
        if(akin.currentStep > 0) {
            output['components'].push(playBackRow);
        }
    }
    return output;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('akinator')
            .setDescription('Play Akinator through beanbot :D')
            .addStringOption(option =>
                option.setName('type')
                .setDescription('The type of Akinator game to play.')
                .setRequired(true)
                .addChoice('Characters', 'en')
                .addChoice('Objects', 'en_objects')
                .addChoice('Animals', 'en_animals')),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            var reply = await interaction.fetchReply();

            var region = await interaction.options.getString('type');
            var childMode = false;
            var proxy = false;

            const akinator = new Aki({region, childMode, proxy});
            await akinator.start();
            await interaction.editReply(await createMessage(akinator));

            const filter = filter => filter.customId === 'yes' || filter.customId === 'no' || filter.customId === 'dk' || filter.customId === 'prob' || filter.customId === 'probn' || filter.customId === 'winyes' || filter.customId === 'winno' || filter.customId === 'back';
            const collector = interaction.channel.createMessageComponentCollector({filter, time: 600000});

            collector.on('collect', async i => {
                if(i.message.id === reply.id) {
                    var response = 0;
                    var step = true;
                    if(i.customId === 'yes') {response = 0;}
                    else if(i.customId === 'no') {response = 1;}
                    else if(i.customId === 'dk') {response = 2;}
                    else if(i.customId === 'prob') {response = 3;}
                    else if(i.customId === 'probn') {response = 4;}
                    else if(i.customId === 'winyes') {
                        step = false;
                        await i.update({components: []});
                    } else if(i.customId === 'winno' || i.customId === 'back') {
                        step = false;
                        await akinator.back();
                        await i.update(await createMessage(akinator));
                    }
                    if(step) {
                        console.log();
                        await akinator.step(response);
                        await i.update(await createMessage(akinator));
                    }
                }
            });

            // eslint-disable-next-line no-unused-vars
            collector.on('end', async collected => {
                await interaction.editReply({components: []});
            });
            
        } catch (error) {
            console.error(error);
        }
    }
}