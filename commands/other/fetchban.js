const { EmbedBuilder, italic } = require('discord.js');

module.exports = {
  name: 'fetchban',
  aliases: ['fetchbans', 'baninfo', 'fbi'],
  args: true,
  usage: '<id>',
  category: 'Other',
  description: 'Check ban info about a certain user.',
  icOnly: true,
  async execute(message, args, client) {
    const id = args[0];

    const banInfo = await message.guild.bans.fetch(id).catch(() => {
      return message.channel.send(
        'Either the user is not banned or the user ID provided is not valid.'
      );
    });

    if (!banInfo) return;

    const embed = new EmbedBuilder()
      .addFields([
        { name: 'User:', value: banInfo.user.username, inline },
        { name: 'ID:', value: banInfo.user.id},
        {
          name: 'Reason:',
          value: banInfo?.reason ?? italic('No reason provided'),
        }
      ])
      .setThumbnail(banInfo.user.displayAvatarURL())
      .setTimestamp()
      .setColor('Blurple');

    message.channel.send({ embeds: [embed] });
  }
};
