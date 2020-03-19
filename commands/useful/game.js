const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const steam = require('steam-searcher');

module.exports = class GameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'game',
            group: 'useful',
            memberName: 'game',
            description: 'Returns the first Steam result for a game search',
			examples: ['beanbot game Half Life'],
			args: [
				{
				key: 'gsearch',
				prompt: 'enter your search terms dummy',
				type: 'string'
				}
			]
        });
    }
    run(message, { gsearch }) {
        async function main() {
			var gameSearch = gsearch;
			steam.find({search: gameSearch}, function (err, game) {
				if(err != null) {
					message.channel.send('An error has occurred.');
					message.channel.send(err.message);
					return;
				}
				if(game.hasOwnProperty('price_overview') == false)
				{
					var gameCurrency = '';
					if(game.is_free){
						var gamePrice = 'Free!';
					}
					else {
						gamePrice = '¯\\_(ツ)_/¯';
					}
				}
				else {
					gamePrice = game.price_overview.final_formatted;
					var gameCurrency = game.price_overview.currency;
				}
				const gameEmbed = new RichEmbed()
					.setColor('#0099ff')
					.setTitle(game.name)
					.setDescription('https://store.steampowered.com/app/'+game.steam_appid)
					.addField('Price', gamePrice + ' ' + gameCurrency, true)
					.addField('Release Date', game.release_date.date)
					.setImage(game.header_image)
					.setFooter('Game info credit: Steam Parser by MAPReiff')
				message.channel.send(gameEmbed);
			});
        }
        main();
    }
};