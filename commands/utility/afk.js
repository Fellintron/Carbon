const userSchema = require('../../database/models/user');

module.exports = {
  name: 'afk',
  cooldown: 5,
  category: 'Utility',
  usage: '[reason]',
  description: 'Sets an AFK status and dislays the status when someone pings you while you are AFK.',
  async execute(message, args, client) {
    const reason = args.join(' ') || 'AFK';

    await userSchema.findOneAndUpdate(
      { userId: message.author.id },
      { afk: { reason, timestamp : message.createdTimestamp} },
      { upsert: true }
    );

    message.channel.send({
     embeds: createEmbed(`${message.author.toString()}, I have set your AFK: ${reason}.`)
    });

   if (message.guild.members.me.permissions.has('ManageNicknames') && message.author.id !== message.guild.onwerId && message.member.roles.highest.position < message.guild.members.me.roles.highest.position)
   {
     message.member.setNickname(`[AFK] ${message.member.displayName}`);
   }

    client.afks.push(message.author.id, { reason, timestamp });
  }
};
