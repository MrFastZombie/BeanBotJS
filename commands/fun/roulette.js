const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js'); // eslint-disable-line no-unused-vars
const random = require('random');

function generateCylinder(chamber, bullets) {
    function count(array, value) {
        var count = 0;
        array.forEach(element => {
            if(element === value) count++;
        })
        return count;
    }

    var cylinder = [];
    cylinder.length = chamber;
    cylinder.fill(false);
    
    while(count(cylinder, true) < bullets) {
        var targetChamber = random.int(0, cylinder.length-1);
        if(cylinder[targetChamber] === false) {
            cylinder[targetChamber] = true;
        }
    }
    return cylinder;
}

function createEmbed(numOfChambers, bulletCount, player, currentChamber, cylinder, int, speen) {
    var cChamb = currentChamber;
    var embed = new MessageEmbed().setColor('#0099ff').setTitle('Bean Roullete');
    var chamberField = {name: 'Current chamber', value: (currentChamber+2).toString()};

    if(speen) {
        chamberField = {name: 'Current chamber', value: 'SPEEEEN'}
        cChamb = random.int(0, cylinder.length-1);
        console.log();
    }

    if(cylinder[cChamb] === true) {
        cylinder[cChamb] = false;
        int.followUp(player + ' just got beaned.');
        int.user.send({content: 'beaned', files: ['./data/images/beaned.png']}).catch(err => console.log(err.message));

        if(!cylinder.includes(true)) {
            embed.setColor('#F04747');
            embed.setDescription('Game over.');
        } else {
            embed
            .setDescription('Game with ' + numOfChambers + ' chambers & ' + bulletCount + ' beans loaded.')
            .addFields(
                {name: 'Last player', value: player},
                {name: 'Last Result', value: 'Beaned'},
                chamberField
            );
        }
    } else {
        embed
        .setDescription('Game with ' + numOfChambers + ' chambers & ' + bulletCount + ' beans loaded.')
        .addFields(
            {name: 'Last player', value: player},
            {name: 'Last Result', value: 'Survived'},
            chamberField
        );
    }
        
    return embed;
}

function createButton(canContinue) {
    var playButton = new MessageButton().setCustomId('playButton').setLabel('Fire').setStyle('DANGER');
    var actionRow = new MessageActionRow().addComponents(playButton);
    if(canContinue) {
        return [actionRow];
    } else {
        return [];
    }
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('roulette')
            .setDescription('Russian Roulette but the winner gets beaned instead of killed :D')
            .addIntegerOption(option =>
                option.setName('chambers')
                .setDescription('Number of chambers in the bean gun.')
                .setRequired(false))
            .addIntegerOption(option =>
                option.setName('beannum')
                .setDescription('Number of potential beans loaded in the bean game.')
                .setRequired(false))
            .addBooleanOption(option =>
                option.setName('speen')
                .setDescription('True to spin every round, false to spin only once.')
                .setRequired(false)),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            var currentChamber = 0;
            var numOfChambers = await interaction.options.getInteger('chambers');
            var bulletCount = await interaction.options.getInteger('beannum');
            var speen = await interaction.options.getBoolean('speen');

            if(numOfChambers === null) {numOfChambers = 6;}
            if(bulletCount === null) {bulletCount = 1;}
            if(speen === null) {speen = false;}

            if(numOfChambers <= 0 || bulletCount <= 0) {
                await interaction.editReply({content: 'Cannot have less than 1 chambers or beans', ephemeral: true});
            } else if (numOfChambers < bulletCount) {
                await interaction.editReply({content: 'Number of beans cannot be more than number of chambers.', ephemeral: true});
            } else {
                var cylinder = generateCylinder(numOfChambers, bulletCount);
                //await interaction.editReply(cylinder.toString().replaceAll('false,', 'f').replaceAll('true,', 't').replaceAll('false', 'f').replaceAll('true', 't'));
                const filter = filter => filter.customId === 'playButton';
                const collector = interaction.channel.createMessageComponentCollector({filter, time: 600000});
                await interaction.editReply({content: 'Get ready to get beaned', embeds: [createEmbed(numOfChambers, bulletCount, interaction.member.displayName, currentChamber, cylinder, interaction, speen)] , components: createButton(cylinder.includes(true))});

                collector.on('collect', async i => {
                    const reply = await interaction.fetchReply();
                    if(i.message.id === reply.id) {
                        var user = i.member.displayName;
                        currentChamber++;
                        var args = {embeds: [createEmbed(numOfChambers, bulletCount, user, currentChamber, cylinder, i, speen)], components: createButton(cylinder.includes(true))};
                        await i.update(args);
                    }
                })

                collector.on('end', async collected => {
                    var endEmbed = new MessageEmbed().setColor('#F04747').setTitle('Bean Roullete').setDescription('Game over.');
                    await interaction.editReply({embeds: [endEmbed], components: []});
                })
            }
        } catch (error) {
            console.error(error);
        }
    }
}