const { Command } = require('discord.js-commando');
const path = require('path');
var bullet = 0
var globLoc = 0;


module.exports = class RouletteCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'roulette',
            group: 'fun',
            memberName: 'roulette',
            description: 'Like russian roulette, but the loser gets beaned instead of killed.',
            examples: ['beanbot roulette']
        });
    }
    run(message) {
        async function main() {
            const fileDir = path.join(__dirname, '../../data/images/beaned.png');

            if(bullet == 0) { //Do this stuff at the start of a match
                var bulletlocation = Math.floor(Math.random() * (7-1) + 1); //Generate a number between 1-6, this is the loaded chamber.
                globLoc = bulletlocation; //Store the loaded chamber in a global variable, to keep it loaded between separate instances of the command (relative to this file)
                message.say('starting new round...');
                bullet=1; //Fire the first round
                if(bullet == globLoc) { //Check if the first round is the one that was loaded.
                    message.say('oh no you got beaned on the first shot you scrub');
                    message.say('match over');
                    message.author.send('beaned', {files: [fileDir] });
                    bullet = 0; //Reset the bullet counter
                    return;
                }
                    else { //If the first chamber was not loaded, congratulate the player
                        message.say('You survived round ' + bullet + '/6');
                        bullet++;
                        return;
                    }
            }
                else if(bullet == globLoc ) { //If we are not on the first chamber, check if the current chamber is loaded.
                    message.say('oh no you got beaned you scrub');
                    message.say('match over');
                    message.author.send('beaned', {files: [fileDir] });
                    bullet = 0;
                    return;
                } 
                    else { //If not, congratulate and continue.
                        message.say('You survived round ' + bullet + '/6');
                        bullet++;
                        return;
                    }
        }
        main(); 
    }
};