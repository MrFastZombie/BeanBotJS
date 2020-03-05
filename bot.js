const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const dotenv = require('dotenv').config();
const dtoken = process.env.DISCORD_TOKEN;


const client = new CommandoClient({
    commandPrefix: 'beanbot ',
    owner: '197406355026345994',
    invite: '',
    disableEveryone: true
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun', 'fun commands'],
        ['utility', 'useful commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));


client.once('ready', () => {
    console.log('Logged in')
});

client.login(dtoken);