const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars
const translate = require('@vitalets/google-translate-api');
const languages = ['af', 'am', 'ar', 'az', 'be', 'bg', 'bn', 'bs', 'ca', 'ceb', 'co', 'cs', 'cy', 'da', 'de', 'el', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'fy', 'ga', 'gd', 'gl', 'gu', 'ha', 'haw', 'he', 'hi', 'hmn', 'hr', 'ht', 'hu', 'hy', 'id', 'ig', 'is', 'it', 'iw', 'ja', 'jw', 'ka', 'kk', 'km', 'kn', 'ko', 'ku', 'ky', 'la', 'lb', 'lo', 'lt', 'lv', 'mg', 'mi', 'mk', 'ml', 'mn', 'mr', 'ms', 'mt', 'my', 'ne', 'nl', 'no', 'ny', 'pa', 'pl', 'ps', 'pt', 'ro', 'ru', 'sd', 'si', 'sk', 'sl', 'sm', 'sn', 'so', 'sq', 'sr', 'st', 'su', 'sv', 'sw', 'ta', 'te', 'tg', 'th', 'tl', 'tr', 'uk', 'ur', 'uz', 'vi', 'xh', 'yi', 'yo', 'zh-CN', 'zh-TW', 'zu'];


function trans(input, targetLanguage) {
    var output;
    try {
        output = translate(input, {to: targetLanguage}).then(res => {
            return res.text;
        })
    } catch (error) {
        //console.error(error);
        throw 'Encounted an error!';
    }
    return output;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('badtranslate')
            .setDescription('Badly Google translate a phrase.')
            .addStringOption(option =>
                option.setName('input')
                .setDescription('The phrase to translate.')
                .setRequired(true)),
    async execute(interaction) {
        try {
            await interaction.deferReply();
            let input = interaction.options.getString('input');

            if(input.length > 5000) {
                await interaction.editReply('The phrase is too long.');
            } else {
                let output = 'If you get this message, something went wrong.';
                for (let i = 0; i < 5; i++) {
                    let languageSeed = Math.floor(Math.random() * (languages.length - 1) + 1);
                    input = await trans(input, languages[languageSeed]);
                }
                output = await trans(input, 'en');
                interaction.editReply(output);
            }
        } catch (error) {
            console.error(error);
            interaction.editReply('Encounted an error :(');
        }
    }
}