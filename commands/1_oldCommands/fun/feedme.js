const { Command } = require('discord.js-commando');
//const { RichEmbed } = require('discord.js'); //Including because I might use embeds for this in the future
const fs = require('fs');
const neatCsv = require('neat-csv');
const path = require('path');

async function readCSV(content) { //Used to read CSV files.
	const result = await neatCsv(content);
	return result;
}

module.exports = class FeedCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'feed',
            group: 'fun',
            memberName: 'feed',
            description: 'offers you a meal :)',
            examples: ['beanbot feed me'],
            args: [
                {
                    key: 'me',
                    prompt: 'whomst shall be fed',
                    type: 'string'
                }
            ]
        });
    }
    run(message, { me }) {
        async function main() {
            const foodir = path.join(__dirname, '../../data/food.csv'); //Have to use path.join for some reason.
            const food = await readCSV(fs.readFileSync(foodir));
            var foodSel = []; //Create an array to store the selected food items.
            var recipient = '';

            //The if-else block below checks who's recieving the food so that Beanbot may use the proper nouns for each case.
            if(me.toLowerCase() == 'me' || me.toLowerCase() == 'i') {
                recipient = 'you';
            }
            else if(me.toLowerCase() == 'you') {
                recipient = 'me';
            }
            else {
                recipient = me;
            }

			for(var i = 0; i < 3; i++) { //Selects three random food emojis from the CSV.
				var foodSeed = Math.floor(Math.random() * (food.length -1) + 1);
				foodSel.push(food[foodSeed]);
			}
			message.say(String.fromCodePoint(foodSel[0].jscode) + String.fromCodePoint(foodSel[1].jscode) + String.fromCodePoint(foodSel[2].jscode));
			return message.say('I present to ' + recipient + ' ' +foodSel[0].name + ' with ' + foodSel[1].name + ' and ' + foodSel[2].name);
       }
       main();
       return;
    }
};