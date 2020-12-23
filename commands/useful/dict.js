const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const dotenv = require('dotenv').config();
const Owlbot = require('owlbot-js');
const Owlbotclient = Owlbot(process.env.OWLBOT_TOKEN);
//var index = 0;

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
    async run(message, { wsearch }) {
			var index = 0
			var ableToContinue = 1;
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
			var owlDefs = await getDict(wsearch).catch(error => {
				if(!(error.message.includes('404'))) { //For errors that are not 404 errors.
					message.say('I have encountered a serious error and it is all your fault.')
					console.error(error);
				}
				else { //For errors that are 404 errors.
					message.say('Could not find any results.');
				}
				ableToContinue = 0; //The bot must stop executing the command.
			});

			if(ableToContinue == 0) {return;} //End execution if an error has occured 

			/* EMBED DEFINITION */
			owlEmbed.title = wsearch;
			owlEmbed.description = owlDefs.definitions[0].definition;
			owlEmbed.fields[0].value = owlDefs.definitions[0].type;
			owlEmbed.fields[1].value = owlDefs.pronunciation;
			owlEmbed.image.url = owlDefs.definitions[0].image_url;
			owlEmbed.fields[2].value = 1 + ' of ' +owlDefs.definitions.length;
			/* END OF EMBED DEFINITION */

			var dictMSG = await message.say({ embed: owlEmbed }); //Store the embed message for later so it can be edited.
				dictMSG.react('⬅️')
					.then(() => dictMSG.react('➡️'))
					.catch(() => console.error('Failed to react on message '));

			const filter = (reaction, user) => (reaction.emoji.name === '⬅️' || reaction.emoji.name === '➡️') && user.id != '674022563621634069';
			let collector = dictMSG.createReactionCollector(filter, { time: 60000 });

			collector.on('collect', (reaction, user) => {
				console.log("I collected :)");
				var reconstruct = 0;
				reaction.users.remove(user.id);
				if(reaction.emoji.name == '➡️'&&index != owlDefs.definitions.length-1) {
					index = index+1;
					reconstruct = 1;
				}
				else if(reaction.emoji.name == '⬅️'&&index != 0) {
					index = index-1;
					reconstruct = 1;
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
					dictMSG.edit(new Discord.MessageEmbed(owlEmbed));
				}
			});

			collector.on('end', collected => {
				dictMSG.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
				index = 0;
			})

			//var updateMSG = await message.say('While this message is still here, you can type prev and next to cycle through definitions. This opportunity expires in one minute.'); //Store the cycle opportunity message for later, so it can be deleted.
    }
};