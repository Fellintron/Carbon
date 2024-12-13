const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  TextChannel
} = require('discord.js');
const serverSettings = require('../database/models/settingsSchema');
const skulls = require('../database/models/skullboard');

module.exports = {
  name: 'messageReactionAdd',
  once: false,
  async execute(reaction, user, client) {
    if (!reaction?.emoji?.name || reaction?.emoji?.name !== '💀') return;
    if (reaction.message.webhookId || reaction.message.author?.bot) return;
    
    const guildConfig = await serverSettings.findOne({
      guildID: reaction.message.guild.id
    });
    
    if (!guildConfig || !guildConfig?.skullBoard?.enabled) return;
    
    const { count, channelId } = guildConfig.skullBoard;
    
    const reactions = await reaction.fetch();
    if (reactions.count < count) return;
    
    let skullBoardMessage = await skulls.findOne({
      messageId: reaction.message.id
    });
    
    if (skullBoardMessage) {
      console.log('Skullboard message exists')
      skullBoardMessage.count++;
      
      const channel = await client.channels.fetch(channelId);
      
      const message= await channel.messages.fetch(exists.skullBoardMessageId);
      
      const embed = EmbedBuilder.from(message.embeds[0])
      embed.setTitle(`**${reactions.count} :skull:**`);
      
      await message.edit({
        embeds: [embed]
      });
      
      skullBoardMessage.save();
      return;
    }

  const channel = await client.channels.fetch(channelId);
    if (!channel) return;
    
await reaction.message.fetch().catch(() => null)

    const embed = new EmbedBuilder()
      .setAuthor({
        name: reaction.message?.author?.username,
        iconURL: reaction.message?.author?.displayAvatarURL(),
        url: reaction.message.url
      })
      .setDescription(message.content || ' ')
      .setImage(message.attachments.first()?.url)
      .setTitle(`**${reaction.count} :skull:**`);

    const skullBoardMessage = await channel.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setEmoji('🔗')
            .setStyle(ButtonStyle.Link)
            .setURL(message.url)
            .setLabel('Jump to Message')
        ])
      ]
    });

    const z = new skulls({
      messageId: message.id,
      channelId: message.channel.id,
      authorId: message.author.id,
      guildId: message.guild.id,
      count: reaction.count,
      skullBoardMessageId: temp.id
    });
  }
};
