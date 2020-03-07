const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const neatCsv = require('neat-csv');
const path = require('path');

async function readCSV(content) { //Used to read CSV files.
	const result = await neatCsv(content);
	return result;
}

async function loadFlav() {
    const fileDir = path.join(__dirname, '../../data/beanflavors.csv');
    const flavors = await readCSV(fs.readFileSync(fileDir));

    return flavors;
}

module.exports = class FlavCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'flavor',
            group: 'fun',
            memberName: 'flavor',
            description: 'Replies with an embed for a random bean flavor from beanflavors.csv',
            examples: ['beanbot flavor']
        });
    }
    run(message) {
        async function main() {
            /*-----------------------------------------------------FLAVOR TESTING-----------------------------------------------------*/
            var flavors = await loadFlav();
            //console.log("Testing flavors...");
            var flav = [];
            for(var tI = 0; tI<flavors.length-1; tI++) {
                var flavorTestSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
                while(flav.includes(flavorTestSeed.toString()) == true) {
                    var flavorTestSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
                }
                //console.log(flavors[flavorTestSeed].short+ ' ' +tI); //Uncomment this if you want each flavor printed to the console.
                if(flav.includes(flavorTestSeed).toString() == true) {
                    console.log('WARNING: ' + flavors[flavorTestSeed].short + ' was selected multiple times.');
                }
                if(flavorTestSeed==0) {console.log('Zero is included.');}
                flav.push(flavorTestSeed.toString());
            }
            flav.sort(function(a, b){return a-b});
            //console.log('Done loading flavors.');
            /*-----------------------------------------------------END OF FLAVOR TESTING-----------------------------------------------------*/

            var flavorSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
                const flavorEmbed = new RichEmbed()
                    .setColor('#0099ff')
                    .setTitle(flavors[flavorSeed].long + ' Beans')
                    .setDescription(flavors[flavorSeed].description)
                    .setImage(flavors[flavorSeed].image)
                    .setFooter('Flavor ' + flavorSeed + '/' + (flavors.length-1))
                
                //message.channel.send(flavors[flavorSeed].long);
                return message.embed(flavorEmbed);
        }
        main();
        

    }
};