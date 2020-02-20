const Discord = require('discord.js');
const client = new Discord.Client();
require('dotenv').config();
const dtoken = process.env.DISCORD_TOKEN; //You need to define DISCORD_TOKEN in a .env file. This requires dotenv
const prefix = "beanbot";

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
	var mCont = message.content.toLowerCase();

	if(!mCont.startsWith(prefix)) return;
	if(message.author.bot) return;

	if(message.content === 'ping') {
		message.channel.send('pong');
	}
	if(mCont.toLowerCase === 'flavor') {
		message.channel.send('test');
	}
});

client.login(dtoken);