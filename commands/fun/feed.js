const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const neatCsv = require('neat-csv');

async function readCSV(content) { //Used to read CSV files.
	const result = await neatCsv(content);
	return result;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('feed')
            .setDescription('Beanbot will feed your target')
            .addStringOption(option =>
                option.setName('target')
                .setDescription('Who will be fed?')
                .setRequired(true)),
    async execute(interaction) {

        try {
            var target = interaction.options.getString('target');
            var recipient;
            const foodir = './data/food.csv'; //Have to use path.join for some reason.
            const food = await readCSV(fs.readFileSync(foodir));
            var foodSel = []; //Create an array to store the selected food items.

            //The if-else block below checks who's recieving the food so that Beanbot may use the proper nouns for each case.
            if(target.toLowerCase() == 'me' || target.toLowerCase() == 'i') {
                recipient = 'you';
            }
            else if(target.toLowerCase() == 'you') {
                recipient = 'me';
            }
            else {
                recipient = target;
            }

            for(var i = 0; i < 3; i++) { //Selects three random food emojis from the CSV.
				var foodSeed = Math.floor(Math.random() * (food.length -1) + 1);
				foodSel.push(food[foodSeed]);
			}

            await interaction.reply(String.fromCodePoint(foodSel[0].jscode) + String.fromCodePoint(foodSel[1].jscode) + String.fromCodePoint(foodSel[2].jscode));
            await interaction.channel.send('I present to ' + recipient + ' ' +foodSel[0].name + ' with ' + foodSel[1].name + ' and ' + foodSel[2].name);
        } catch (error) {
            console.error(error);
        }
    }
}