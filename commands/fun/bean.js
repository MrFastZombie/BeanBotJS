const { Command } = require('discord.js-commando');
const path = require('path');

module.exports = class BeanCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'bean',
            group: 'fun',
            memberName: 'bean',
            description: 'Sends a bean meme to the tagged user.',
            examples: ['beanbot bean @user','beanbot bean @user message', 'beanbot bean @MrFastZombie u smelly'],
            args: [
                {
                    key: 'recipient',
                    prompt: 'tag the user who you wish to bean my dude',
                    type: 'user'
                },
                {
                    key: 'umessage',
                    prompt: 'type a message to send to the user',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }
    run(message, { recipient, umessage }) {
        async function main() {
            const fileDir = path.join(__dirname, '../../data/images/beaned.png');
            const unoDir = path.join(__dirname, '../../data/images/uno.png');
            if(recipient.id == undefined) {
                return message.say('invalid input you bean')
            }
            else if (recipient.id == '674022563621634069') {
                message.author.send('beaned', {files: [fileDir] });
                return message.say('I AM THE ONE WHO BEANS', {files: [unoDir] });
            }
            else {
                if(umessage != '') {
                    recipient.send(umessage);
                }
                recipient.send('beaned', {files: [fileDir] });
                return message.say('they just got beaned');
            }
        }
        main().catch((error) => {
            console.error(error);
        });
        
    }
};