# BeanBot

A discord bot themed around beans. Yes, beans. This bot is more of a personal project I have used to learn about JavaScript and to add some fun commands to my friend's server, but anyone is free to check out the code or use the bot for their own projects, just keep in mind that the code may not be perfect.

## How to install

1. Make sure you have Node.JS installed and be sure to install the included Windows build tools.
2. Clone this repository.
3. Navigate to the folder repository's in a CMD and type `npm install`, it will install the dependencies.
4. Create a .env file in the same directory as bot.js and follow the .env guide below. Just name it .env.
5. Run the command registration script by running `npm run deploy-commands`. Note that this only registers to the one or two guilds specified in the .env. This bot is not yet written to exist on many servers.
6. Use `run.bat` or navigate to the folder with `bot.js` with CMD and type `node bot.js` to run. Please note that the bat file may be able to reboot from a crash, but running it directly with the command line instead may not.

## How to create a .env

When you have created the .env (NOT AS A .TXT), use this as a template.
**DISCORD_GUILD_IDS** is for registering commands to test or personal servers instantly by running the command registration script. They should be seperated by a comma and a space, so that they can be loaded as an array for the command registration script. Do not leave out the space after each comma.

**DISCORD_TOKEN** is your bot token. **DISCORD_USER_ID** is your bot's user ID.

```env
# .env
DISCORD_TOKEN=YOURTOKENHERE
DISCORD_GUILD_IDS="GUILDID1, GUILDID2, GUILDID3"
DISCORD_USER_ID="BOT'S USER ID HERE"
```

[Follow this guide to get your token.](https://www.writebots.com/discord-bot-token/)
