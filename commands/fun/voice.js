const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('voice')
            .setDescription('Have BeanBot say something in your current voice channel!')
            .addStringOption(option =>
                option.setName('file')
                .setDescription('The file to play.')
                .setRequired(true)
                .addChoice('beaned', 'beaned.mp3')
                .addChoice('goku', 'goku.mp3')),
    async execute(interaction) {
        try {
            var channel = await interaction.member.voice.channelId;
            var guildId = await interaction.guildId;
            var adapterCreator = interaction.guild.voiceAdapterCreator;
            var file = './data/' + interaction.options.getString('file');
            var audioPlayer = createAudioPlayer();
            var subscription;

            if(channel === null) { 
                await interaction.reply({content: 'You are not in a valid voice channel :(', ephemeral: true});
            } else if(fs.existsSync(file)) {
                var resource = createAudioResource(fs.createReadStream(file));
                const connection = joinVoiceChannel({
                    channelId: channel,
                    guildId: guildId,
                    adapterCreator: adapterCreator
                });
                
                await interaction.reply({content: 'Playing ' + await interaction.options.getString('file'), ephemeral: true});
                subscription = connection.subscribe(audioPlayer);
                connection.on(VoiceConnectionStatus.Ready, () => {
                    audioPlayer.play(resource);
                })

                audioPlayer.on(AudioPlayerStatus.Playing, () => {
                    audioPlayer.on(AudioPlayerStatus.Idle, () => {
                        subscription.unsubscribe();
                        audioPlayer.stop();
                        connection.destroy();
                    })
                });
                
            } else {
                await interaction.reply({content: 'Invalid file, could not be found.', ephemeral: true});
                console.warn('Invalid file argument was passed: ' + file); //Should not be possible, so will console.warn if it does.
            }
        } catch (error) {
            console.error(error);
        }
    }
}