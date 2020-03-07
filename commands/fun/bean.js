const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class BeanCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'bean',
            group: 'fun',
            memberName: 'bean',
            description: 'Sends a bean meme to the tagged user.',
            examples: ['beanbot bean @user'],
            args: [
                {
                    key: 'recipient',
                    prompt: 'tag the user who you wish to bean my dude',
                    type: 'user'
                }
            ]
        });
    }
    run(message, { recipient }) {
        async function main() {
            const fileDir = path.join(__dirname, '../../data/images/beaned.png');
            if(recipient.id == undefined) {
                return message.say('invalid input you bean')
            }
            else if(recipient.id == '348868707965075467') {
                return message.say('this person does not understand the power of beans and I cannot bean them :(');
            }
            else if (recipient.id == '674022563621634069') {
                message.author.send('beaned', {files: [fileDir] });
                return message.say('I AM THE ONE WHO BEANS');
            }
            else {
                return recipient.send('beaned', {files: [fileDir] });
            }
        }
        main();
        
    }
};