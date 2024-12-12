const db = require('../database/models/user');
const { EmbedBuilder } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (!message.guild) return;
    if (message.guild.id !== client.config.guildId) return;
    if (message.author.bot || message.webhookId) return;

    const now = Date.now();

    if (client.afkIgnore.includes(message.channel.id)) return;
    if (client.afks.includes(message.author.id)) {
      const index = client.afks.indexOf(message.author.id);
      client.afks.splice(index, 1);

      message.member.setNickname(
        message.member.displayName.replace(/~ AFK/g, '')
      );

      const result = await db.findOneAndUpdate(
        { userId: message.author.id },
        { afk: undefined },
        { omitUndefined: true }
      );
      console.log('Result', result);
      message.channel
        .send(
          `Welcome back ${message.member}, I have removed your AFK. You were AFK for ${prettyMilliseconds(now - result.afk.timestamp, { verbose: true, secondsDecimalDigits: 0 })}`
        )
        .then((response) => {
          setTimeout(() => {
            response.delete();
          }, 10 * 1_000);
        });
    }

    if (!message.mentions.users.size) return;

    if (message.mentions.users.size === 1) {
      const user = message.mentions.users.first();
      const data = await db.findOne({ userId: user.id });

      if (!data || !data?.afk) return;

      message.channel.send(
        `${user.username} is currently AFK: ${
          data.reason
        } - <t:${(data.afk.timestamp / 1000).toFixed(0)}:R>`
      );
    } else {
      let content = [];
      for (let i = 0; i < message.mentions.user.size; i++) {
        const user = message.mentions.users.at(i);
        const data = client.afks.find((afkUserId) => afkUserId === user.id);

        if (data) {
          content.push(
            `${user.username} ${
              data.reason
            } - <t:${(data.afk.timestamp / 1000).toFixed(0)}:R>`
          );
        }
      }

      message.channel.send(
        'The following users are currently AFK:\n' + content.join('\n -')
      );
    }
  }
};
