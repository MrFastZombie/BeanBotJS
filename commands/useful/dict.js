const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const dotenv = require('dotenv').config();
const Owlbot = require('owlbot-js');
const Owlbotclient = Owlbot(process.env.OWLBOT_TOKEN);
var index = 0;

async function getDict(input) {
	var dictResult = Owlbotclient.define(input).then(function(result) {
		if(!(typeof result === 'object')) {
			message.say('you have broken me you fool');
			return false;
		}
		else{
				return result;
		}
	});
	return await dictResult;
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
					{
						name: 'Index',
						value: 'haha index go hmmmmmmmmmmmmmmmmmmmmmmmmmm'
					},
				],
				image: {
					url: 'https://i.imgur.com/2MOhFcf.png'
				},
				footer: {
					text: 'Dictionary services courtesy of OwlBot API'
				},
			};
			var owlDefs = await getDict(wsearch);
			const filter = m => message.author.id;
			const collector = message.channel.createMessageCollector(filter, { time: 60000 });

			collector.on('collect', m => {
				var reconstruct = 0;
				if(m.content == 'next'&&index != owlDefs.definitions.length-1) {
					index = index+1;
					reconstruct = 1;
					m.delete();
				}
				else if(m.content == 'prev'&&index != 0) {
					index = index-1;
					reconstruct = 1;
					m.delete();
				}
				else if(m.content == 'next' || m.content == 'prev') {
					m.delete();
				}
				if(reconstruct == 1) {
					/* EMBED DEFINITION */
					owlEmbed.title = wsearch;
					owlEmbed.description = owlDefs.definitions[index].definition;
					owlEmbed.fields[0].value = owlDefs.definitions[index].type;
					owlEmbed.fields[1].value = owlDefs.pronunciation;
					owlEmbed.image.url = owlDefs.definitions[index].image_url;
					owlEmbed.fields[2].value = index+1 + ' of ' +owlDefs.definitions.length;
					/* END OF EMBED DEFINITION */
					dictMSG.edit(new RichEmbed(owlEmbed));
				}
			});

			collector.on('end', collected => {
				updateMSG.delete();
				index = 0;
			})

			/* EMBED DEFINITION */
			owlEmbed.title = wsearch;
			owlEmbed.description = owlDefs.definitions[index].definition;
			owlEmbed.fields[0].value = owlDefs.definitions[index].type;
			owlEmbed.fields[1].value = owlDefs.pronunciation;
			owlEmbed.image.url = owlDefs.definitions[index].image_url;
			owlEmbed.fields[2].value = index+1 + ' of ' +owlDefs.definitions.length;
			/* END OF EMBED DEFINITION */

			var dictMSG = await message.say({ embed: owlEmbed }); //Store the embed message for later so it can be edited.
			var updateMSG = await message.say('While this message is still here, you can type prev and next to cycle through definitions. This opportunity expires in one minute.'); //Store the cycle opportunity message for later, so it can be deleted.
        }
        main();
    }
};