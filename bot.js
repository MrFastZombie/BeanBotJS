//Revision 1
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

async function run() {
	const flavors = await readCSV(fs.readFileSync('./beanflavors.csv'));
	console.log('Done loading flavors.');
	console.log(flavors[1].short);

	client.once('ready', () => {
		console.log('Ready!');
		client.user.setActivity('beans', {type: "PLAYING"});
	});

	client.on('ready', () => {
		setInterval(() => {
			const index = Math.floor(Math.random() * (status.length -1) + 1);
			client.user.setActivity(status[index], {type: "PLAYING"});
			console.log('set new status');
		}, 600000);
	});
	
	client.on('message', message => {
		var mCont = message.content.toLowerCase();

		if(message.author.id == '95717881165123584' && kong == 1) { //This is for kong mode. Basically, it reacts with :xkong: on one of my friend's server, but only on his messages.
			message.react('565923253323956224');
		}
	
		if(mCont.startsWith(prefix) == false) return;
		if(message.author.bot) return;
	
		if(mCont === prefix + 'ping') {
			message.channel.send('pong');
		}
		if(mCont === prefix + 'flavor') {
			var flavorSeed = Math.floor(Math.random() * (flavors.length -1) + 1) //Math.round(Math.random()*10);
			const flavorEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle(flavors[flavorSeed].long + ' Beans')
				.setDescription(flavors[flavorSeed].description)
				.setImage(flavors[flavorSeed].image)
			
			message.channel.send(flavors[flavorSeed].long);
			message.channel.send(flavorEmbed);
		}

		if(mCont === prefix + 'kong') {
			if(kong === 0) {
				kong = 1;
				message.channel.send('Kong-mode enabled.');
				message.channel.send(':Xkong:');
			}
			else {
				kong = 0
				message.channel.send('Kong-mode disabled.');
			}
		}
	});
}
run();



client.login(dtoken);