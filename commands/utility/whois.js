const { EmbedBuilder, bold, italic, inlineCode} = require('discord.js');
const dedent = require('dedent');

module.exports = {
  name: 'whois',
  category: 'Utility',
  aliases: ['ui', 'userinfo'],
  description: 'Shows mutual guilds with the bot and information about them.',
  usage: '[user]',
  async execute(message, args, client) {
      const user = resolveUser(args.join(' '));
      
      const mutualServers = [];
      
      for await (const guild of client.guilds.cache.values()) {
          if (await guild.members.fetch(user.id)) {
            mutualServers.push(
              `${bold(guild.name)} (${ inlineCode(guild.id)
              }) ${italic(guild.memberCount.toLocaleString() + 'members')}`
            );
          }
      }
      
      const embed = new EmbedBuilder()
        .setAuthor({
          name: user.username,
        })
        .setThumbnail(user.displayAvatarURL())
        .setDescription(
          dedent`
          **__Account created at__:** ${timestamp(
            user.createdAt
          )} ( ${timestamp(
            user.createdAt,
            'D'
          )} ago )
          
          **__User ID__:** ${user.id}
          **__Mutual Servers__:**
          ${mutualServers.join('\n -') ?? 'No mutual servers'}`
        )
        .setColor('Blurple');

      message.reply({
        embeds: [embed]
      });
  }
};
