const { EmbedBuilder , italic } = require('discord.js')

module.exports = {
  name: 'fetchban',
  aliases: ['fetchbans', 'baninfo'],
  args: true,
  usage: '<id>',
  category: 'Moderation',
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
  { name: 'User:', value: banInfo.user.username, inline: true}, 
  { name: 'ID:', value: banInfo.user.id, inline: true  }, 
  { name: 'Reason:', value: banInfo?.reason ?? italic('No reason provided'), inline: true }
  ])
.setThumbnail(banInfo.user.displayAvatarURL())
.setTimestamp()
.setColor(client.color)

    message.channel.send({ embeds: [embed]});
  }
};
