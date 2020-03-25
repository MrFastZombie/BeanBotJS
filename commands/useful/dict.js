const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const dotenv = require('dotenv').config();
const Owlbot = require('owlbot-js');
const Owlbotclient = Owlbot(process.env.OWLBOT_TOKEN);

module.exports = class DictCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dict',
            group: 'useful',
            memberName: 'dict',
            description: 'Defines the input word',
			examples: ['beanbot dict word','beanbot dict beans'],
			args: [
				{
				key: 'wsearch',
				prompt: 'enter your word dummy',
				type: 'string'
				}
			]
        });
    }
    run(message, { wsearch }) {
        async function main() {
			var dictResult = Owlbotclient.define(wsearch).then(function(result) {
				if(!(typeof result === 'object')) {
					message.say('you have broken me you fool');
				}
				else{
						const owlEmbed = new RichEmbed()
						.setColor('#0099ff')
						.setTitle(wsearch)
						.setDescription(result.definitions[0].definition)
						.addField('Word type', result.definitions[0].type)
						.setImage(result.definitions[0].image_url)
						.setFooter('Dictionary services courtesy of OwlBot API')
					message.say(owlEmbed);
				}
			});
        }
        main();
    }
};