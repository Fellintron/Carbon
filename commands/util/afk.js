const userSchema = require('../../database/models/user');
const guildSchema = require('../../database/models/settingsSchema');

module.exports = {
  name: 'afk',
  cooldown: 5,
  category: 'Utility',
  usage: '[reason]',
  description: 'Displays an AFK message when someone pings you.',
  async execute(message, args, client) {
    await guildSchema.findOneAndUpdate(
      { guildID: message.guild.id },
      { afkIgnore: [] },
      { upsert: true }
    );

    const timestamp = Date.now();
    const reason = args.join(' ') || 'AFK';

    await userSchema.findOneAndUpdate(
      { userId: message.author.id },
      { afk: { reason, timestamp } },
      { upsert: true }
    );

    message.channel.send({
      content: `${message.author.toString()}, I have set your AFK: ${reason}.`, allowedMentions: { parse: [] }
    });

   if (message.guild.members.me.permissions.has('ManageNicknames') && message.author.id !== message.guild.onwerId && message.member.roles.highest.position < message.guild.members.me.roles.highest.position)
   {
     message.member.setNickname(`[AFK] ${message.member.displayName}`);
   }

    client.afks.push(message.author.id, { reason, timestamp });
  }
};
