const db = require('../database/models/user');
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message, client) {
    if (!message.guild) return;
    if (message.guild.id !== client.config.guildId) return;
    if (message.author.bot || message.webhookId) return;
    
    if (client.afkIgnore.includes(message.channel.id)) return;
    if (client.afks.includes(message.author.id)) {
      const index = client.afks.indexOf(message.author.id)
      client.afks.splice(index, 1);
      
      message.member.setNickname(
        message.member.displayName.replace(/~ AFK/g, '')
      );
      
      message.channel
        .send(`Welcome back ${message.member}, I have removed your AFK.`)
        .then((response) => {
          setTimeout(() => {
            response.delete();
          }, 5000);
        });
        
      await db.findOneAndUpdate({ userId: message.author.id }, { afk: undefined }, { omitUndefined: true });
    }
    
    if (!message.mentions.users.size) return;
   
   if (message.mentions.users.size === 1) {
    const user = message.mentions.users.first()
    const data = await db.findOne({ userId: user.id });

    if (!data || !data?.afk) return;

    message.channel.send(
      `${user.username} is currently afk: ${
        data.reason
      } - <t:${(data.afk.timestamp / 1000).toFixed(0)}:R>`);
  } else {
    let content;
    for (let i=0; i<message.mentions.user.size; i++) {
    const user = message.mentions.users.first();
    const data = await db.findOne({ userId: user.id });

    if (!data) {

    message.channel.send(
      `${message.mentions.users.at(i).username} is currently afk: ${
        user.reason
      } - <t:${(user.afk.timestamp / 1000).toFixed(0)}:R>`);
    }
    }
  }
  }
};
