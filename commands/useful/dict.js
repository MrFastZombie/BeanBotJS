const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const dotenv = require('dotenv').config();
const Owlbot = require('owlbot-js');
const Owlbotclient = Owlbot(process.env.OWLBOT_TOKEN);

function getDict(input, index) {
	var dictResult = Owlbotclient.define(input).then(function(result) {
		const owlEmbed = {
			color: 0x0099ff,
			title: 'blank title',
			description: 'blank desc',
			fields: [
				{
					name: 'Word Type',
					value: 'if you see this then something went wrong'
				},
				{
					name: 'Pronunciation',
					value: 'enjoy this picture'
				},
			],
			image: {
				url: 'https://i.imgur.com/2MOhFcf.png'
			},
			footer: {
				text: 'Dictionary services courtesy of OwlBot API'
			},
		};

		if(!(typeof result === 'object')) {
			message.say('you have broken me you fool');
			return false;
		}
		else{
				owlEmbed.title = input;
				owlEmbed.description = result.definitions[index].definition;
				owlEmbed.fields[0].value = result.definitions[index].type;
				owlEmbed.fields[1].value = result.pronunciation;
				owlEmbed.image.url = result.definitions[index].image_url
				return owlEmbed;
		}
	});
}

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
			const embed = getDict(wsearch, 0);
			var dictMSG = await message.say({ embed: embed });
			console.log('e');
        }
        main();
    }
};