const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const { Aki } = require('aki-api');

async function createEmbed(aki) {
    try {
        var curStep = aki.currentStep;
        var embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Akinator")
            .setDescription(aki.question)
            .setFooter("Question " + (curStep+1))

        return embed;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function stepEmbed(aki, answer) {
    try {
        aki.step(answer);
        return await createEmbed(aki);
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function winEmbed(aki) {
    try {
        await aki.win();
        var curStep = aki.currentStep;
        var embed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle("Akinator")
            .setDescription("I think of " + aki.answers[0].name + "with probability of " + aki.answers[0].proba)
            .setImage(aki.answers[0].absolute_picture_path)
            .setFooter("Question " + (curStep+1))

        return embed;
    } catch (error) {
        console.error(error);
        return null;
    }
}

module.exports = class AkinatorCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'akinator',
            group: 'fun',
            memberName: 'akinator',
            description: 'Lets you play an akinator game!',
            examples: ['beanbot akinator']
        });
    } //End of Constructor(client)

    async run(message) {
        var gameEmbed = new Discord.MessageEmbed();
        const aki = new Aki('en');
        var answer;
        var gameFinish = false;
        await aki.start();
        gameEmbed = await createEmbed(aki);
        var gameMSG = await message.say({ embed: gameEmbed });
            gameMSG.react('🇾')
                .then(() => gameMSG.react('🇳'))
                .then(() => gameMSG.react('769012034557706271'))
                .then(() => gameMSG.react('🇵'))
                .then(() => gameMSG.react('🇺'))
                .catch(() => console.error("Failed to react on message."));
        const filter = (reaction, user) => (reaction.emoji.name === '🇾' || reaction.emoji.name === '🇳' || reaction.emoji.name === '🇵' || reaction.emoji.name === '🇺' || reaction.emoji.id === '769012034557706271') && user.id != '674022563621634069';
        let collector = gameMSG.createReactionCollector(filter, { time: 600000 });
        collector.on('collect', async (reaction, user) => {
            try {
                if(message.guild != null) {
                    reaction.users.remove(user.id);
                }
    
                if(reaction.emoji.name == '🇾') {
                    answer = 0;
                }
                else if(reaction.emoji.name == '🇳') {
                    answer = 1;
                }
                else if(reaction.emoji.id == '769012034557706271') {
                    answer = 2;
                }
                else if(reaction.emoji.name == '🇵') {
                    answer = 3;
                }
                else if(reaction.emoji.name == '🇺') {
                    answer = 4;
                }
                console.log("Answered " + answer + " for " + aki.question);
                var newEmbed = await stepEmbed(aki, answer);
                
    
                if(aki.progress >= 85) {
                    newEmbed = await winEmbed(aki);
                }
                gameMSG.edit(new Discord.MessageEmbed(newEmbed));
            } catch (error) {
                console.error(error);
            }
        });

        collector.on('end', collected => {
            if(message.guild != null) {
                gameMSG.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            }
        });
        
    }

} //End of module.exports