module.exports = {
  name: 'restart',
  category: 'Developer',
  aliases: ['reboot'],
  async execute(message, args, client) {
    if (!client.config.developers.includes(message.author.id)) {
      return message.reply(`${client.emojis.cross} Only developers can use command.`);
    }
    
    await message.channel.send('Restarting, please wait.');
    
    process.exit();
  }
};
