//Revision 3
//BeanBot by MrFastZombie#2959
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv').config();
const fs = require('fs');
const neatCsv = require('neat-csv');
const dtoken = process.env.DISCORD_TOKEN; //You need to define DISCORD_TOKEN in a .env file. This requires dotenv
const prefix = "beanbot ";
const status = [
	"bean snorting simulator",
	"beansusSummon.exe",
	"putting beans in places where beans should not be",
	"spreading beanism",
	"beans"
]
var kong = 0;

async function readCSV(content) {
	const result = await neatCsv(content);
	return result;
}

async function run() { //Most of the program is inside this run function so that the CSV loads properly.
	const flavors = await readCSV(fs.readFileSync('./data/beanflavors.csv'));
	
	//---------------------------------------------------------------------- FLAVOR TESTING ----------------------------------------------------------------------//
	console.log("Testing flavors...");
	var flav = [];
	for(var tI = 0; tI<flavors.length-1; tI++) {
		var flavorTestSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
		while(flav.includes(flavorTestSeed.toString()) == true) {
			var flavorTestSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
		}
		//console.log(flavors[flavorTestSeed].short+ ' ' +tI); //Uncomment this if you want each flavor printed to the console.
		if(flav.includes(flavorTestSeed).toString() == true) {
			console.log('WARING: ' + flavors[flavorTestSeed].short + ' was selected multiple times.');
		}
		if(flavorTestSeed==0) {console.log('Zero is included.');}
		flav.push(flavorTestSeed.toString());
	}
	flav.sort(function(a, b){return a-b});
	console.log('Done loading flavors.');
	//---------------------------------------------------------------------- FLAVOR TESTING ----------------------------------------------------------------------//

	client.once('ready', () => { //Runs when the bot is connected and ready.
		console.log('Ready!');
		client.user.setActivity('beans', {type: "PLAYING"});
	});

	client.on('ready', () => { //This block is for changing the status on an interval. Should still work fine if more are added to const status above.
		setInterval(() => {
			const index = Math.floor(Math.random() * (status.length -1) + 1);
			client.user.setActivity(status[index], {type: "PLAYING"});
			console.log('set new status');
		}, 600000);
	});
	
	client.on('message', message => {
		var mCont = message.content.toLowerCase(); //Stores the message as lowercase to make it not case-sensitive for the users.

		if(message.author.id == '95717881165123584' && kong == 1) { //If kong mode is enabled, it will annoy one of my friends with a custom emote on his server.
			message.react('565923253323956224');
		}
	
		if(mCont.startsWith(prefix) == false) return; //Does not process messages past this point if they do not have the prefix.
		if(message.author.bot) return; //Ignores other bots
	
		if(mCont === prefix + 'ping') { //This was basically just a test command.
			message.channel.send('pong');
		}

		if(mCont === prefix + 'flavor') { //Picks a random flavor from a CSV file and replies with an embed with the flavor. Some have images and they have descriptions.
			var flavorSeed = Math.floor(Math.random() * (flavors.length -1) + 1);
			const flavorEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle(flavors[flavorSeed].long + ' Beans')
				.setDescription(flavors[flavorSeed].description)
				.setImage(flavors[flavorSeed].image)
				.setFooter('Flavor ' + flavorSeed + '/' + (flavors.length-1))
			
			message.channel.send(flavors[flavorSeed].long);
			message.channel.send(flavorEmbed);
		}

		if (mCont.startsWith(prefix + 'flavor#')) {
			var number = parseInt(mCont.slice(16, message.content.length));
			const weedEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle('Weed-Flavored Beans')
				.setDescription('snoop beann')
				//.setImage()
				.setFooter('Flavor ' + '420' + '/' + (flavors.length-1))

			const hellEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle('Satanic Beans')
				.setDescription('et satanas praesentem faba debet mori tecum non te mori mori')
				.setImage('https://i.imgur.com/e2uGihK.png')
				.setFooter('Flavor ' + '666' + '/' + (flavors.length-1))

			const holyEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle('Holy Beans')
				.setDescription('Accept beanism into your life, my child.')
				//.setImage(flavors[number].image)
				.setFooter('Flavor ' + '333' + '/' + (flavors.length-1))

			if(number == 420) {
				message.channel.send(weedEmbed);
				return;
			}
	
			if(number == 666) {
				message.channel.send(hellEmbed);
				return;
			}
			if(number == 333) {
				message.channel.send(holyEmbed);
				return;
			}


			if((number > flavors.length-1) || (number < 0)) {message.channel.send('invalid number you bean'); return;}

			if(number != 'NaN')
			{
				message.channel.send(flavors[number].long);

				const flavorEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle(flavors[number].long + ' Beans')
				.setDescription(flavors[number].description)
				.setImage(flavors[number].image)
				.setFooter('Flavor ' + number + '/' + (flavors.length-1))

				message.channel.send(flavorEmbed);
			}
			else {
				message.channel.send('that input is beans');
				return;
			}
			
		}

		if(mCont === prefix + 'kong') { //Enables or disables Kong mode.
			if(kong === 0) {
				kong = 1;
				message.channel.send('Kong-mode enabled.');
				message.channel.send('<:Xkong:565923253323956224>');
			}
			else {
				kong = 0
				message.channel.send('Kong-mode disabled.');
				message.channel.send(':(');
			}
		}

//THE FOLLOWING COMMAND IS DISABLED BECAUSE IT BARELY EVEN WORKS YET
/*		if(mCont.startsWith(prefix + 'beanify')) {
			var slicedMessage = message.content.slice(16,message.content.length);
			var beanified = "bean";
			var half1 = "";
			var half2 = "";

			for(var i = 0; i < slicedMessage.length; i++) {
				if(slicedMessage[i] == 'b') {
					if(slicedMessage[i+1]=='e') {
						if(slicedMessage[i+2] == 'a' || slicedMessage[i+2] == 'e') {
							for(var j = 0; j < i+3; j++) {
								half1 = half1 + slicedMessage[j];
							}
							for(var k = i+3; k < slicedMessage.length; k++) {
								half2 = half2+slicedMessage[k];
							}
							if(slicedMessage[i+3] == 'n') {
								slicedMessage = half1+half2;
							}
							else {
								slicedMessage = half1+'n'+half2;
							}
						}
					}
				}
			}
			message.channel.send(slicedMessage);
		}
*/

		if(mCont.startsWith(prefix + 'bean')) { //DM's the mentioned user with the bean'd image. 
			var userid = message.mentions.users.first();
			if(userid.id == '348868707965075467') {
				message.channel.send('this person does not understand the power of beans');
				return;
			}
			console.log(userid);
			if (userid == null) {return;}
			message.channel.send('they just got beaned');
			userid.sendMessage('beaned', {files: ["./data/images/beaned.png"] });
		}
	});
}
run();

client.login(dtoken);