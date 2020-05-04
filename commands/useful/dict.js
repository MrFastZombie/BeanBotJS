const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const dotenv = require('dotenv').config();
const Owlbot = require('owlbot-js');
const Owlbotclient = Owlbot(process.env.OWLBOT_TOKEN);

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = class DictCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'dict',
            group: 'useful',
            memberName: 'dict',
            description: 'Defines the input word. If there are multiple definitions, you can cycle through them by saying next and previous.',
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
						.addField('Pronunciation', result.pronunciation)
						.setImage(result.definitions[0].image_url)
						.setFooter('Dictionary services courtesy of OwlBot API')
					message.say(owlEmbed);
					var filter = message.content.includes('next'||'previous');
					const collector = message.channel.createMessageCollector(filter, { time: 30000 });
					message.say("If you see this message, you can say next or previous to cycle through definitions.");
					//await sleep(30000); //Wait 30 seconds for the user to input a next or previous command.
				}
			});
        }
        main();
    }
};