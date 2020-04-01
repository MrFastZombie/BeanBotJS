const { Command } = require('discord.js-commando');
//const Discord = require('discord.js');
//const client = new Discord.Client();
const lEmotes = [ //EmoteIDs for all of the letters of the alphabet. Used for the dance command.
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

module.exports = class DanceCommand extends Command {
    constructor(client) { 
        super(client, {
            name: 'dance',
            group: 'fun',
            memberName: 'dance',
            description: 'Replies with the input as dancing emojis.',
            examples: ['beanbot dance we are all going to die'],
            args: [
                {
                    key: 'dinput',
                    prompt: 'type what you want me to dance to pls',
                    type: 'string'
                }
            ]
        });
    }
    run(message, { dinput }) {
        //async function main() {
            var output = '';
            var ddinput = dinput.toLowerCase();
            for(var i = 0; i < ddinput.length; i++) {
				var charCode = ddinput.charCodeAt(i) - 97;
				if((charCode > 26 || charCode < 0) && charCode != -65) {
					output = output + '';
				}
				else if(charCode == -65) {
					output = output + '          ';
				}
				else {
					output = output + this.client.emojis.get(lEmotes[charCode]).toString() + ' ';
				}

            }
            if(output.length>2000) {
				return message.say('that is too long (for now) ;)');
			}
			else if(output == '') {
				return message.say('i do not know that dance :(');
			}
			else {
			    return message.say(output);
			}
       // }
       // main();
    }
};