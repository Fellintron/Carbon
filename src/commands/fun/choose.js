const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  Colors
} = require('discord.js');

module.exports = {
  name: 'choose',
  /**
   *
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: message.author.username,
        iconURL: message.author.displayAvatarURL()
      })
      .setColor(Colors.Orange);
    const clean = args.join(' ');
    if (clean.includes(',')) {
      const choices = clean.split(',');
      const choice = choices[Math.floor(Math.random() * choices.length)];
      embed.setDescription(`You chose ${choice}`);
      message.reply({ embeds: [embed] });
    } else {
      const choices = clean.split(' ');
      const choice = choices[Math.floor(Math.random() * choices.length)];
      embed.setDescription(`You chose ${choice}`);
      message.reply({ embeds: [embed] });
    }
  }
};
