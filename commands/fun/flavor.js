const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const neatCsv = require('neat-csv');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('flavor')
            .setDescription("Beanbot shows you a random flavor of beans.")
            .addIntegerOption(option => 
                option.setName('number')
                .setDescription('ID number of the flavor to show')
                .setRequired(false)),
    async execute(interaction) {
        async function readCSV(content) {
            const result = await neatCsv(content);
            return result;
        }
        
        async function loadFlav() {
            const fileDir = './data/beanflavors.csv';
            const flavors = await readCSV(fs.readFileSync(fileDir));
            return flavors;
        }

        var number = interaction.options.getInteger('number');
        var flavors = await loadFlav();
        var flav = [];

        /*-----------------------------------------------------FLAVOR TESTING-----------------------------------------------------*/
        /*                                                 WELCOME TO FLAVOR TOWN                                                 */
        for(var tI = 0; tI<flavors.length-1; tI++) {
            var flavorTestSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
            while(flav.includes(flavorTestSeed.toString()) == true) {
                flavorTestSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
            }
            //console.log(flavors[flavorTestSeed].short+ ' ' +tI); //Uncomment this if you want each flavor printed to the console.
            if(flav.includes(flavorTestSeed).toString() == true) {
                console.log('WARNING: ' + flavors[flavorTestSeed].short + ' was selected multiple times.');
            }
            if(flavorTestSeed==0) {console.log('Zero is included.');}
            flav.push(flavorTestSeed.toString());
        }
        flav.sort(function(a, b){return a-b});
        /*-------------------------------------------------END OF FLAVOR TESTING-------------------------------------------------*/
        try {
            var flavorSeed = Math.floor(Math.random() * (flavors.length -1) + 1); //First, generate a random number within the range of the flavors.
                if(number > 0 && number < flavors.length) { //Use the user input number if it is contained within the array. 
                    flavorSeed = number;
                }
                const flavorEmbed = new MessageEmbed() //Then define an embed, using data from the selected flavor (flavorSeed).
                    .setColor('#0099ff')
                    .setTitle(flavors[flavorSeed].long + ' Beans')
                    .setDescription(flavors[flavorSeed].description)
                    .setImage(flavors[flavorSeed].image)
                    .setFooter('Flavor ' + flavorSeed + '/' + (flavors.length-1))

            await interaction.reply({embeds: [flavorEmbed]});
        } catch (error) {
            console.error(error);
        }
    }
}