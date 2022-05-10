const { SlashCommandBuilder, time } = require('@discordjs/builders');
const { Interaction } = require('discord.js'); // eslint-disable-line no-unused-vars

const timezones = [
    ['UTC-12', '-12'],
    ['UTC-11', '-11'],
    ['UTC-10', '-10'],
    ['UTC-9', '-9'],
    ['UTC-8', '-8'],
    ['UTC-7', '-7'],
    ['UTC-6', '-6'],
    ['UTC-5', '-5'],
    ['UTC-4', '-4'],
    ['UTC-3', '-3'],
    ['UTC-2', '-2'],
    ['UTC-1', '-1'],
    ['UTC', '+0'],
    ['UTC+1', '+1'],
    ['UTC+2', '+2'],
    ['UTC+3', '+3'],
    ['UTC+4', '+4'],
    ['UTC+5', '+5'],
    ['UTC+6', '+6'],
    ['UTC+7', '+7'],
    ['UTC+8', '+8'],
    ['UTC+9', '+9'],
    ['UTC+10', '+10'],
    ['UTC+11', '+11'],
    ['UTC+12', '+12']
];

//why did i decide that a time zone command was a good idea

/*
    <t:1624855717> 		short date time: 	June 27, 2021 9:48 PM
    <t:1624855717:f> 	short date time 	June 27, 2021 9:48 PM
    <t:1624855717:F> 	long date time: 	Sunday, June 27, 2021 9:48 PM
    <t:1624855717:d> 	short date: 		06/27/2021
    <t:1624855717:D> 	long date: 		June 27, 2021
    <t:1624855717:t> 	short time: 		9:48 PM
    <t:1624855717:T> 	long time: 		9:48:37 PM
    <t:1624855717:R> 	relative time: 		2 days ago
*/

function constructTag(time, type) {
    let output = '<t:';
    let cap = '>';
    switch (type) {
        case 'shortdt':
            cap = ':f>';
            break;
        case 'longdt':
            cap = ':F>';
            break;
        case 'shortd':
            cap = ':d>';
            break;
        case 'longd':
            cap = ':D>';
            break;
        case 'shortt':
            cap = ':t>';
            break;
        case 'longt':
            cap = ':T>';
            break;
        case 'relt':
            cap = ':R>';
            break;
        default:
            console.log('ERROR: Couldn\'t convert type into valid tag.');
            break;
    }
    return output + time + cap;
}

module.exports = {
    data: new SlashCommandBuilder()
            .setName('tagtime')
            .setDescription('Have BeanBot post a time tag that converts to local time for other users.')
            .addSubcommand(subcommand =>
                subcommand.setName('date')
                .setDescription('Input a date as well as time to create the time tag.')
                .addIntegerOption(option =>
                    option.setName('month')
                    .setDescription('The month to use. Valid: 1-12')
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('day')
                    .setDescription('The day to use. Valid: 1-29, 32 depending on month')
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('year')
                    .setDescription('The year to use, in format YYYY. ex: 2021')
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('hour')
                    .setDescription('The hour to use.')
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('minutes')
                    .setDescription('The minute time to use.')
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName('meridiem')
                    .setDescription('Whether the time should be interpreted as as AM, PM, or 24hr.')
                    .addChoices([
                        ['AM', 'AM'],
                        ['PM', 'PM'],
                        ['24hr', '24']
                    ])
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName('timezone')
                    .setDescription('Select your timezone in order to get an accurate time. Take DST into account if applicable.')
                    .addChoices(timezones)
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName('display_mode')
                    .setDescription('How to display the date/time.')
                    .setRequired(false)
                    .addChoices([['Short date + time: Feb 1, 2021 12:00 PM (Default)', 'shortdt'], 
                                ['Long date + time: Monday, Feb 1, 2021 12:00 PM', 'longdt'],
                                ['Short date: 02/01/2021', 'shortd'],
                                ['Long date: February 1, 2021', 'longd'],
                                ['Short time: 12:00 PM', 'shortt'],
                                ['Long time: 12:00:00 PM', 'longt'],
                                ['Relative time: 12 days ago', 'relt']]))
                .addStringOption(option =>
                    option.setName('message')
                    .setDescription('Message for the output. Include $s where you want the tag or no $s to have it appended to the end.')
                    .setRequired(false))
                .addBooleanOption(option =>
                    option.setName('print_tag')
                    .setDescription('Whether you just want the tag or for beanbot to post it')
                    .setRequired(false)))
            .addSubcommand(subcommand =>
                subcommand.setName('time')
                .setName('time')
                .setDescription('Only input time, and use today as the date.')
                .addIntegerOption(option =>
                    option.setName('hour')
                    .setDescription('The hour to use.')
                    .setRequired(true))
                .addIntegerOption(option =>
                    option.setName('minutes')
                    .setDescription('The minute time to use.')
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName('meridiem')
                    .setDescription('Whether the time should be interpreted as as AM, PM, or 24hr.')
                    .addChoices([
                        ['AM', 'AM'],
                        ['PM', 'PM'],
                        ['24hr', '24']
                    ])
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName('timezone')
                    .setDescription('Select your timezone in order to get an accurate time. Take DST into account if applicable.')
                    .addChoices(timezones)
                    .setRequired(true))
                .addStringOption(option =>
                    option.setName('display_mode')
                    .setDescription('How to display the date/time.')
                    .setRequired(false)
                    .addChoices([['Short date + time: Feb 1, 2021 12:00 PM (Default)', 'shortdt'], 
                                ['Long date + time: Monday, Feb 1, 2021 12:00 PM', 'longdt'],
                                ['Short date: 02/01/2021', 'shortd'],
                                ['Long date: February 1, 2021', 'longd'],
                                ['Short time: 12:00 PM', 'shortt'],
                                ['Long time: 12:00:00 PM', 'longt'],
                                ['Relative time: 12 days ago', 'relt']]))
                    .addStringOption(option =>
                        option.setName('message')
                        .setDescription('Message for the output. Include $s where you want the tag or no $s to have it appended to the end.')
                        .setRequired(false))
                    .addBooleanOption(option =>
                        option.setName('print_tag')
                        .setDescription('Whether you just want the tag or for beanbot to post it')
                        .setRequired(false))),

    async execute(interaction) {
        try {
            let timezone = await interaction.options.getString('timezone');
            let month = await interaction.options.getInteger('month');
            let day, year, hour, minute, mer;
                if(month !== null) {
                    day = await interaction.options.getInteger('day');
                    year = await interaction.options.getInteger('year');
                }
            hour = await interaction.options.getInteger('hour');
            minute = await interaction.options.getInteger('minutes');
            mer = await interaction.options.getString('meridiem');
            let type = await interaction.options.getString('display_mode');
            let printTag = await interaction.options.getBoolean('print_tag');
            let message = await interaction.options.getString('message');
            let input;
                if(month !== null && month <= 12 && month >= 1) {
                    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    input = months[month-1] + ' ' + day + ', ' + year + ' ' + hour + ':' + minute;
                } else {
                    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const now = new Date;
                    month = months[now.getMonth()];
                    //input = hour + ':' + minute;
                    input = month + ' ' + now.getDate() + ', ' + now.getFullYear() + ' ' + hour + ':' + minute;
                } if(mer == 'AM' || mer == 'PM') {
                    input = input + ' ' +  mer;
                }

            input = input + timezone + ':00';
            let unixTime = new Date(input);
            
            if(type === null) { type = 'shortdt'; }
            if(printTag === null) { printTag = false; }
            
            if(month < 1 || month > 12) { //Out of bounds
                await interaction.reply({content: 'Month ' + month + ' is invalid.', ephemeral: true});
            } else if(isNaN(unixTime)) {
                await interaction.reply({content: 'Input could not be parsed.', ephemeral: true});
            } else if(printTag === true) {
                await interaction.reply({content: 'The tag for your input is: \n' + '\\' + constructTag(unixTime.getTime()/1000, type), ephemeral: true});
            } else if(message !== null) {
                let tag = constructTag(unixTime.getTime()/1000, type);

                if(message.includes('$m')) {
                    message = message.replaceAll('$m', tag);
                } else {
                    message = message + ' ' + tag;
                }
                
                await interaction.reply(message);
            } else {
                await interaction.reply(constructTag(unixTime.getTime()/1000, type));
            }
            
        } catch (error) {
            console.error(error);
        }
    }
}