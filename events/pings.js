const pingSchema = require('../database/models/ping');
const userSchema = require('../database/models/user');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot || message.webookId) return;
   
    if (message.mentions.members.size < 1) return;

    const userSettings = await userSchema.findOne({
      userId: message.author.id
    }).lean();

    if (!userSettings?.messageSettings?.lastPingEnabled) return;

    message.mentions.members.forEach(async (member) => {
        let user = await pingSchema.insertOne({ userId: member.id, timestamp: message.createdTimestamp, content: message.content, });
        
        if (!user) {
          user = new pings({
            userId: member.id,
            pings: []
          });
        }

        user.pings.push({
          when: new Date().getTime(),
          content: message.content,
          message_link: `https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id}`,
          author: message.author.tag,
          channel: message.channel.id
        });
        user.save();
      })
  }
};
