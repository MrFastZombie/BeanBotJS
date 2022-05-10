const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction, MessageEmbed } = require('discord.js'); // eslint-disable-line no-unused-vars
const steam = require('steam-searcher');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('game')
            .setDescription('Search for a game from Steam')
            .addStringOption(option =>
                option.setName('search')
                .setDescription('The game to search for')
                .setRequired(true)),
    async execute(interaction) {
        try {
            var search = interaction.options.getString('search');
            let response = null;
            var gameCurrency, gamePrice;
            var gameEmbed = null;

            await interaction.deferReply();

            await steam.find({search: search}, function (err, game) {
				if(err != null) {
                    response = err.message;
                    if(response != 'No results found') console.error(err.message);
                    interaction.followUp('Steam Parser returned this error: ' + response);
                    return;
				}
				if(game.price_overview === undefined)
				{
					gameCurrency = '';
					if(game.is_free){
						gamePrice = 'Free!';
					}
					else {
						gamePrice = '¯\\_(ツ)_/¯';
					}
				}
				else {
					gamePrice = game.price_overview.final_formatted;
					gameCurrency = game.price_overview.currency;
				}

                gameEmbed = new MessageEmbed()
					.setColor('#0099ff')
					.setTitle(game.name)
					.setDescription(game.short_description)
					.addField('Price', gamePrice + ' ' + gameCurrency, true)
                    .addField('URL', 'https://s.team/a/'+game.steam_appid,true) //I believe s.team is the official link shortener for Steam. It is used for friend links. 
					.addField('Developer', game.developers[0], true)
					.addField('Release Date', game.release_date.date, true)
                    .addField('Client URL', 'steam://store/' + game.steam_appid, true)
					.addField('Publisher', game.publishers[0], true)
					.setImage(game.header_image)
					.setFooter('Game info credit: Steam Parser by MAPReiff');

                    if(gameEmbed != null) {
                        interaction.editReply({embeds: [gameEmbed]});
                    } else { interaction.editReply('Something went wrong :('); }
                    return;
            });

        } catch (error) {
            console.error(error);
        }
    }
}