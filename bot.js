//BeanBot by MrFastZombie#2959
const Discord = require('discord.js');
const client = new Discord.Client();
const dotenv = require('dotenv').config();
const fs = require('fs');
const neatCsv = require('neat-csv');
const steam = require('steam-searcher');
const dtoken = process.env.DISCORD_TOKEN; //You need to define DISCORD_TOKEN in a .env file. This requires dotenv
const prefix = "beanbot ";
const status = [
	"bean snorting simulator",
	"beansusSummon.exe",
	"putting beans in places where beans should not be",
	"spreading beanism",
	"beans"
]
const lEmotes = [
	"683575345294737410", //A
	"683567369007792236", //B
	"683575345688870922", //C
	"683575345789927435", //D
	"683575346724995083", //E
	"683575346674794498", //F
	"683575347043762212", //G
	"683575346968264710", //H
	"683575346930384916", //I
	"683575346884509713", //J
	"683575346918064136", //K
	"683575346771132448", //L
	"683575346716475485", //M
	"683575346628395029", //N
	"683575346867470348", //O
	"683575347014664222", //P
	"683575346376736794", //Q
	"683575346934972436", //R
	"683575346645303320", //S
	"683575346984910892", //T
	"683575346603491361", //U
	"683575346897223697", //V
	"683575346842435605", //W
	"683575346934841344", //X
	"683575346850824192", //Y
	"683575347031048224" //Z
]
var kong = 0;

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

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
	//---------------------------------------------------------------------- END OF FLAVOR TESTING ----------------------------------------------------------------------//

	const food = await readCSV(fs.readFileSync('./data/food.csv'));
	
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
	
	//-------------------------------------------------------------------------------------------CHAT COMMANDS-------------------------------------------------------------------------------------------//
	client.on('message', async message => {
		var mCont = message.content.toLowerCase(); //Stores the message as lowercase to make it not case-sensitive for the users.

		if(message.author.id == '95717881165123584' && kong == 1) { //If kong mode is enabled, it will annoy one of my friends with a custom emote on his server.
			message.react('565923253323956224');
		}

		if(mCont.startsWith('fuck beans')) {
			message.react('🖕');
			return;
		}
	
		if(mCont.startsWith(prefix) == false) return; //Does not process messages past this point if they do not have the prefix.
		if(message.author.bot) return; //Ignores other bots
	
		if(mCont === prefix + 'ping') { //This was basically just a test command.
			message.channel.send('pong');
		} //End of ping

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
		} //End of flavor

		if (mCont.startsWith(prefix + 'flavor#')) {
			var number = parseInt(mCont.slice(16, message.content.length));
			const weedEmbed = new Discord.RichEmbed()
				.setColor('#0099ff')
				.setTitle('Weed-Flavored Beans')
				.setDescription('snoop bean')
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
			
		} //End of flavor#

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
		} //End of kong

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
			if(userid == undefined) {
				message.channel.send('invalid input you bean');
				return;
			}
			if(userid.id == '348868707965075467') {
				message.channel.send('this person does not understand the power of beans and i cannot bean them :(');
				return;
			}
			if(userid.id == '674022563621634069') {
				message.channel.send('I AM THE ONE WHO BEANS');
				var authorID = message.author;
				authorID.sendMessage('beaned', {files: ["./data/images/beaned.png"]});
				return;
			}
			console.log(userid);
			if (userid == null) {return;}
			message.channel.send('they just got beaned');
			userid.sendMessage('beaned', {files: ["./data/images/beaned.png"] });
		} //End of bean

		if(mCont.startsWith(prefix + 'vbean')) {
			if(message.member.voiceChannel != undefined) {
				const connection = await message.member.voiceChannel.join();
				const dispatcher = connection.playFile('./data/beaned.mp3');
				dispatcher.setVolume(1);
				//setTimeout(function(), 5000);
				await sleep(10000);
				dispatcher.on('finish', () => {
					
				});
				dispatcher.destroy();
				message.guild.me.voiceChannel.leave();
			}
			else {
				message.channel.send('You must be in the VC channel to do this.');
			}
		} //End of vbean

		if(mCont.startsWith(prefix + 'game')) { //Returns the first result of a Steam search.
			var gameSearch = mCont.slice(13, mCont.length);
			steam.find({search: gameSearch}, function (err, game) {
				if(err != null) {
					message.channel.send('An error has occurred.');
					message.channel.send(err.message);
					return;
				}
				if(game.hasOwnProperty('price_overview') == false)
				{
					var gameCurrency = '';
					if(game.is_free){
						var gamePrice = 'Free!';
					}
					else {
						gamePrice = '¯\\_(ツ)_/¯';
					}
				}
				else {
					gamePrice = game.price_overview.final_formatted;
					var gameCurrency = game.price_overview.currency;
				}
				const gameEmbed = new Discord.RichEmbed()
					.setColor('#0099ff')
					.setTitle(game.name)
					.setDescription('https://store.steampowered.com/app/'+game.steam_appid)
					.addField('Price', gamePrice + ' ' + gameCurrency, true)
					.addField('Release Date', game.release_date.date)
					.setImage(game.header_image)
					.setFooter('Game info credit: Steam Parser by MAPReiff')
				message.channel.send(gameEmbed);
			});
			
		} //End of game command
		
		if(mCont.startsWith(prefix + 'cbt')) {
			message.channel.send('', {files: ["./data/images/c.gif", "./data/images/b.gif", "./data/images/t.gif"] });
		}

		if(mCont.startsWith(prefix + 'dance')) {
			var dInput = mCont.slice(14, mCont.length);
			var output = '';
			for(var i = 0; i < dInput.length; i++) {
				var charCode = dInput.charCodeAt(i) - 97;
				if((charCode > 26 || charCode < 0) && charCode != -65) {
					output = output + '';
				}
				else if(charCode == -65) {
					output = output + '          ';
				}
				else {
					output = output + client.emojis.get(lEmotes[charCode]).toString() + ' ';
				}

			}
			message.channel.send(output);
		}

		if(mCont.startsWith(prefix + 'say')) {
			var sInput = mCont.slice(12, mCont.length);
			message.channel.send(sInput);
			message.delete();
		}

		if(mCont.startsWith(prefix+'feed me')) {
			var foodSel = [];
			for(var i = 0; i < 3; i++) {
				var foodSeed = Math.floor(Math.random() * (food.length -1) + 1);
				foodSel.push(food[foodSeed]);
			}
			message.channel.send(foodSel[0].jscode);
			message.channel.send('I present to you ' + foodSel[0].name + ' with ' + foodSel[1].name + ' and ' + foodSel[2].name);

		}
	}); //End of on message
} //End of run()
//------------------------------------------------------------------------------------------- END OF CHAT COMMANDS-------------------------------------------------------------------------------------------//
run();

client.login(dtoken);