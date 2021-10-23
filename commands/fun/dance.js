const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars

const lEmotes = [ //EmoteIDs for all of the letters of the alphabet. Used for the dance command. Note: You will need to upload your own if you are self-hosting BeanBot.
	"683575345294737410", //A 0
	"683567369007792236", //B 1
	"683575345688870922", //C 2
	"683575345789927435", //D 3
	"683575346724995083", //E 4
	"683575346674794498", //F 5
	"683575347043762212", //G 6
	"683575346968264710", //H 7
	"683575346930384916", //I 8
	"683575346884509713", //J 9
	"683575346918064136", //K 10
	"683575346771132448", //L 11
	"683575346716475485", //M 12
	"683575346628395029", //N 13
	"683575346867470348", //O 14
	"683575347014664222", //P 15
	"683575346376736794", //Q 16
	"683575346934972436", //R 17
	"683575346645303320", //S 18
	"683575346984910892", //T 19
	"683575346603491361", //U 20
	"683575346897223697", //V 21
	"683575346842435605", //W 22
	"683575346934841344", //X 23
	"683575346850824192", //Y 24
	"683575347031048224"  //Z 25
]

const maxLines = 2;

module.exports = {
    data: new SlashCommandBuilder()
            .setName('dance')
            .setDescription('Beanbot will reply with your message as dancing letters!')
            .addStringOption(option =>
                option.setName('input')
                .setDescription('The string to turn into dancing letters. Non-alphabetical characters will be ignored.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            const client = interaction.client;
            var output = '';
            var success = true;
            var input = interaction.options.getString('input').toLowerCase();

            for (let i = 0; i < input.length; i++) {
                var charCode = input.charCodeAt(i) - 97;
                if((charCode > 26 || charCode < 0) && charCode != -65) { //Invalid characters.
					output = output + '';
				}
				else if(charCode == -65) { //Spaces
					output = output + '          ';
				}
				else { //Valid characters.
					output = output + client.emojis.cache.get(lEmotes[charCode]).toString() + ' ';
				}
            }

            if(output.length>2000 && maxLines <=1) {
                output = "That is too long. :(";
                await interaction.reply(output);
            } else if (maxLines > 1 && output.length > 2000) { //bless this mess :)
                var outputs = [output];

                for(let i = 0; i < maxLines-1; i++) {
                    var splitput = outputs[i].split('           ');
                    while(outputs[i].length > 2000 && success) {
                        let last = splitput.pop();
                        outputs[i] = splitput.join('           ');
                        if (last === undefined || last.length > 2000) { success = false; } else { 
                            if(outputs[i+1] === undefined) { outputs[i+1] = last } else { 
                                outputs[i+1] = last.concat('           ', outputs[i+1]);
                            }
                        }
                    }
                    if(!success || outputs[i+1].length <= 2000) {i = maxLines} else if (i == maxLines-2 && outputs[i+1].length > 2000) { //exit loop
                        success = false;
                    }
                }
                
                if(success) {
                    console.log(outputs[0].length);
                    await interaction.reply(outputs[0]);
                    for(let i = 1; i < outputs.length; i++) {
                        interaction.followUp(outputs[i]);
                    }
                } else {
                    await interaction.reply('One of your words is too long, or your input goes over the current maximum messages of ' + maxLines + '. :(');
                }

            } else if (output == '') {
                output = "I don't know that dance. :(";
                await interaction.reply(output);
            } else {
                await interaction.reply(output);
            }

        } catch (error) {
            console.error(error);
        }
    }
}