const {CommandoClient} = require('discord.js-commando');
const path = require('path');
const WitSpeech = require('node-witai-speech');
const dotenv = require('dotenv').config();
const dtoken = process.env.DISCORD_TOKEN;
const WIT_API_KEY=process.env.WIT_API_KEY;
const prefix = "beanbot ";
var vbeaning = 0;
var listening = 0;
const status = [
	"bean snorting simulator",
	"beansusSummon.exe",
	"putting beans in places where beans should not be",
	"spreading beanism",
	"beans"
]

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/*-----------CODE IN THIS BLOCK COURTESY OF REFRUITY.XYZ-----------*/
const { Transform } = require('stream')

function convertBufferTo1Channel(buffer) {
  const convertedBuffer = Buffer.alloc(buffer.length / 2)

  for (let i = 0; i < convertedBuffer.length / 2; i++) {
    const uint16 = buffer.readUInt16LE(i * 4)
    convertedBuffer.writeUInt16LE(uint16, i * 2)
  }

  return convertedBuffer
}

class ConvertTo1ChannelStream extends Transform {
  constructor(source, options) {
    super(options)
  }

  _transform(data, encoding, next) {
    next(null, convertBufferTo1Channel(data))
  }
}
/* ------------------------------------------------------------- */


const client = new CommandoClient({
    commandPrefix: 'beanbot ',
    owner: '197406355026345994',
    invite: '',
    disableEveryone: true,
    unknownCommandResponse: false,
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['fun', 'fun commands'],
        ['useful', 'useful commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands')); //registers commands in BeanBotJS/commands


client.once('ready', () => {
    console.log('Logged in')
    client.user.setActivity('beans', {type: "PLAYING"});
});

client.on('ready', () => { //This block is for changing the status on an interval. Should still work fine if more are added to const status above.
    setInterval(() => {
        const index = Math.floor(Math.random() * (status.length -1) + 1);
        client.user.setActivity(status[index], {type: "PLAYING"});
        console.log('set new status');
    }, 600000);
});

client.on('message', async message => { //For commands that either do not work well with commando or would be simpler to put here.
    var mCont = message.content.toLowerCase();

    /*--------------------------------------------------START OF VBEAN--------------------------------------------------*/
    if(mCont.startsWith(prefix + 'vbean')) { //Plays the beaned meme audio in the VC channel the message author is in.
        if(message.member.voiceChannel != undefined && vbeaning == 0) {
            const connection = await message.member.voiceChannel.join();
            const dispatcher = connection.playFile('./data/beaned.mp3');
            vbeaning = 1;
            dispatcher.setVolume(1);
            //setTimeout(function(), 5000);
            await sleep(10000);
            dispatcher.on('finish', () => {
                
            });
            dispatcher.destroy();
            message.guild.me.voiceChannel.leave();
            vbeaning = 0

        }
        else {
            message.channel.send('You must be in the VC channel to do this, or I am already vbeaning');
        }
    }
    /*--------------------------------------------------END OF VBEAN--------------------------------------------------*/

    if(mCont.startsWith(prefix + 'text2dance') && listening == 0) {
        const connection = await message.member.voiceChannel.join();
        var user = '95717881165123584';
        const reee = connection.createReceiver();
        const vStream = reee.createPCMStream(user);
        listening = 1;

        connection.on('speaking', (user, speaking) => {
            if(!speaking) {
                return;
            }
        })
    }

    if(mCont.startsWith('fuck beans'||'fuck you beanbot'||'fuck beanbot')) {
        message.react('🖕');
        return;
    }
})

client.login(dtoken);