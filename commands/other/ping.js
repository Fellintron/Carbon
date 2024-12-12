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
            `**Websocket Ping:** ${
              client.ws.ping
            }ms\n**Uptime:** <t:${uptime}:R>\nRoundtrip **Latency:** ${(
              Date.now() - message.createdTimestamp
            ).toLocaleString()}ms`
          )
          .setColor('Blurple')
          .setTimestamp()
      ]
    });
  }
};
