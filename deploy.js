const fs = require('fs');
const { REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config.json');

const commands = [];
const globalCommands = [];
const commandFiles = fs
  .readdirSync('./slashcommands')
  .filter((file) => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./slashcommands/${file}`);
  if (command.global) {
    globalCommands.push(command.data.toJSON());
  } else {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(process.env.token);

(async () => {
  try {
    console.log('[IceCafe] Started refreshing application (/) commands.');

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commands
    });

    console.log('[IceCafe] Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
