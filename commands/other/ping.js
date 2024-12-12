const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'ping',
  aliases: ['ut', 'uptime'],
  category: 'Other',
  description: 'Bot Uptime and ping',
  async execute(message, args, client) {
    const uptime = (new Date() / 1000 - client.uptime / 1000).toFixed();
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `Latency: ${
              client.ws.ping
            }ms\nUptime: <t:${uptime}:R> ${client.functions.formatTime(client.readyAt)}`
          )
          .setFooter({
            text: `The message took ${(
              Date.now() - message.createdTimestamp
            ).toLocaleString()}ms to send.`,
            iconURL:
              client.user.displayAvatarURL({ dynamic: true }) ??
              client.user.displayAvatarURL({
                dynamic: true
              })
          })
          .setTimestamp()
      ]
    });
  }
};
