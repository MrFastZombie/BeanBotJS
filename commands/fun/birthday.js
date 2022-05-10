const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const { joinVoiceChannel, createAudioPlayer, VoiceConnectionStatus, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const fs = require('fs');
const tts = require('discord-tts');
const random = require('random');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('birthday')
            .setDescription('birthday bash')
            .addStringOption(option =>
                option.setName('name')
                .setDescription('Name of the birthday person.')
                .setRequired(true)),
    async execute(interaction) {

        try {
            var id = random.int(0, 10000);
            var name = interaction.options.getString('name');
            var username = interaction.options.getString('name'); //Name for TTS, may be different from name if mentions were used. 
            var channel = await interaction.member.voice.channelId;
            var guildId = await interaction.guildId;
            var adapterCreator = interaction.guild.voiceAdapterCreator;
            var audioPlayer = createAudioPlayer();
            var subscription;
            var birthdaySongs = []; //Stores all the files used for the command instance. 

            if(name.includes('<@')) {
                name = await name.replaceAll(/([^a-zA-Z\d\s:])+/g, '');
                username = await interaction.guild.members.fetch(name);
                username = username.nickname.replaceAll(/([^a-zA-Z\d\s:])+/g, '');
            }

            if(channel === null) { 
                await interaction.reply({content: 'You are not in a valid voice channel :(', ephemeral: true});
            } else {
                await interaction.deferReply();
                var writeStrem = fs.createWriteStream('./temp/' + name + id + '.mp3');
                tts.getVoiceStream(username).pipe(writeStrem);
                var resource = createAudioResource('./temp/' + name + id + '.mp3');
                for(let i = 0; i <= 25; i++) {
                    birthdaySongs.push(createAudioResource('./data/birthday/birthday' + i + '.mp3'));
                }
                
                const connection = joinVoiceChannel({
                    channelId: channel,
                    guildId: guildId,
                    adapterCreator: adapterCreator
                });
                
                await interaction.editReply({content: 'HAPPY BIRTHDAY ' + await interaction.options.getString('name'), ephemeral: false});

                subscription = connection.subscribe(audioPlayer);
                var lastPlayed = resource;
                connection.on(VoiceConnectionStatus.Ready, () => {
                    var index = 0;
                    audioPlayer.play(birthdaySongs[index]);
                    lastPlayed = birthdaySongs[index];
                    index++;
                    audioPlayer.on(AudioPlayerStatus.Idle, () => {
                        if(lastPlayed === resource) {
                            audioPlayer.play(birthdaySongs[index]);
                            lastPlayed = birthdaySongs[index];
                            index++;
                        } else if(lastPlayed != birthdaySongs[24]) {
                            audioPlayer.play(resource);
                            resource = createAudioResource('./temp/' + name + id + '.mp3');
                            lastPlayed = resource;
                        } else {
                            subscription.unsubscribe();
                            audioPlayer.stop();
                            connection.destroy();
                            fs.unlinkSync('./temp/' + name + id + '.mp3');
                        }
                    });
                });

                connection.on(VoiceConnectionStatus.Disconnected, () => { //In case the bot is manually disconnected.
                    subscription.unsubscribe();
                    audioPlayer.stop();
                    connection.destroy();
                    fs.unlinkSync('./temp/' + name + id + '.mp3');
                });
            }

        } catch (error) {
            console.error(error);
        }
    }
}