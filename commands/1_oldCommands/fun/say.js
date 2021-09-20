const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class GameCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'fun',
            memberName: 'say',
            description: 'Makes beanbot say what you type and deletes your message to hide what you have done.',
			examples: ['beanbot say Beanbot is cool']
        });
    }
    run(message) {
        async function main() {
            var mCont = message.content;
            var sInput = mCont.slice(12, mCont.length);
			message.channel.send(sInput);
			message.delete();
        }
        main();
    }
};