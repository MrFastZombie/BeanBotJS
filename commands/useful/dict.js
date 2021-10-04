const { SlashCommandBuilder } = require('@discordjs/builders');
//const { InteractionResponseType } = require('discord-api-types');
const { Interaction, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js'); // eslint-disable-line no-unused-vars
const fetch = require('node-fetch');

function createEmbed(searchTerm, definition, origin, wordType, index, maxIndex, synonyms) {
    var syn = 'N/A';
    if(origin === undefined) { origin = 'N/A'; }
    if(synonyms != undefined) { syn = synonyms.join(', '); }
    if(syn.length == 0) {syn = 'N/A'; }
    else if(syn.length > 1024) { syn = 'Too long :(' }

    return {
        color: 0x0099ff,
        title: searchTerm,
        description: definition,
        fields: [
            {
                name: 'Origin',
                value: origin
            },
            {
                name: 'Word Type',
                value: wordType
            },
            {
                name: 'Synonyms',
                value: syn
            },
            {
                name: 'Index',
                value: index + ' of ' + maxIndex
            },
        ],
        footer: {
            text: 'Data provided by freeDictionaryAPI'
        },
    };
}

function buildComponents(index, length, definitions, wordTypes) {
    var components = [];
    var dictButtonRow = new MessageActionRow();
    var nextButton = new MessageButton().setCustomId('next').setLabel('Next').setStyle('PRIMARY');
    var prevButton = new MessageButton().setCustomId('previous').setLabel('Previous').setStyle('PRIMARY');
    var dictSelectRow = new MessageActionRow()
                        .addComponents(
                            new MessageSelectMenu().setCustomId('type').setPlaceholder('Word Type').addOptions(wordTypes)
                        )
    var buttonsNeeded = true;

    if(length == 1) { //If buttons are unnecessary
        buttonsNeeded = false;
    } else if(index == 0) { //Starting position
        prevButton.setDisabled(true);
        nextButton.setDisabled(false);
    } else if(index > 0 && index < length-1) { //When between first and last index
        prevButton.setDisabled(false);
        nextButton.setDisabled(false);
    } else if(index == length-1) { //When at the end of the list
        prevButton.setDisabled(false);
        nextButton.setDisabled(true);
    }

    if(Object.keys(definitions).length > 1) {
        components.push(dictSelectRow);
    }

    if(buttonsNeeded) {
        dictButtonRow.addComponents([prevButton, nextButton]);
        components.push(dictButtonRow);
    }
    return components;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('dict')
            .setDescription('Look up a word in the Beanster\'s dictionary.')
            .addStringOption(option =>
                option.setName('term')
                .setDescription('Word to look up')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const searchTerm = await interaction.options.getString('term');
            var results = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + searchTerm).then(res => res.json());
            var wordTypes = [];
            var definitions = {};
            var selectedType;
            var index = 0;
            var reply;

            if(results.message) {
                await interaction.reply('Couldn\'t find the word :(');
            } else {
                results.forEach(word => {
                    word.meanings.forEach(meaning => {
                        var success = true;
                        var entry = {label: meaning.partOfSpeech.charAt(0).toUpperCase() + meaning.partOfSpeech.slice(1), value: meaning.partOfSpeech};
                        wordTypes.forEach(type => {
                            if(type.label == entry.label && type.value == entry.value) success = false;
                        });
                        if(success === true) {
                            wordTypes.push(entry);
                            definitions[entry.value] = [];
                        }
                    });
                });
    
                results.forEach(word => {
                    word.meanings.forEach(meaning => {
                        definitions[meaning.partOfSpeech] = definitions[meaning.partOfSpeech].concat(meaning.definitions);
                        definitions[meaning.partOfSpeech].forEach(definition => {
                            definition['origin'] = word.origin;
                        });
                    });
                });
    
                    selectedType = Object.keys(definitions)[0];
                var dictEmbed = createEmbed(searchTerm, definitions[Object.keys(definitions)[0]][0].definition, definitions[Object.keys(definitions)[0]][0].origin, selectedType, '1', definitions[Object.keys(definitions)[0]].length, definitions[Object.keys(definitions)[0]][0].synonyms);

                await interaction.reply({content: 'From Beanster\'s Dictionary:', embeds: [dictEmbed], components: buildComponents(index, definitions[Object.keys(definitions)[0]].length, definitions, wordTypes)});
                
                reply = await interaction.fetchReply();
                
                const componentFilter = filter => filter.customId === 'previous' || filter.customId === 'next' || filter.customId === 'type';

                const collector = interaction.channel.createMessageComponentCollector({componentFilter, time: 120000});

                collector.on('collect', async i => {
                    if(i.message.id === reply.id) { //Only do collection handling if the message is the same.
                        var newDictEmbed;
                        var replyArgs = {};
                        if(i.customId === 'type') {
                            console.log('Collected type');
                            selectedType = i.values[0];
                            index = 0;
                        } else if (i.customId === 'next' ) {
                            index++;
                        } else if (i.customId === 'previous') {
                            index--;
                        }
                        newDictEmbed = createEmbed(searchTerm, definitions[selectedType][index].definition, definitions[selectedType][index].origin, selectedType, index+1, definitions[selectedType].length, definitions[selectedType][index].synonyms);
                        replyArgs['components'] = buildComponents(index, definitions[selectedType].length, definitions, wordTypes);
                        replyArgs['embeds'] = [newDictEmbed];
                        await i.update(replyArgs);
                    }
                    
                });

                collector.on('end', async collected => {
                    await interaction.editReply({components: []});
                })
            }
            
        } catch (error) {
            console.error(error);
        }
    }
}