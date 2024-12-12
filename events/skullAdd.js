const {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  ButtonStyle,
  TextChannel
} = require('discord.js');
const noSpam = [];
const serverSettings = require('../database/models/settingsSchema');
const skulls = require('../database/models/skullboard');
module.exports = {
  name: 'messageReactionAdd',
  once: false,
  async execute(reaction, user, client) {
    if (reaction?.partial) await reaction.fetch()
    if (!reaction?.emoji?.name || reaction?.emoji?.name !== '💀') return;
    
    const guildConfig = await serverSettings.findOne({
      guildID: reaction.message.guild.id
    });
    
    if (!guildConfig || !guildConfig?.skullBoard?.enabled) return;
    
    const { count, channelId } = valid.skullBoard;
    
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

    const embed = new EmbedBuilder()
      .setAuthor({
        name: reaction.message.author.tag,
        iconURL: reaction.message.author.displayAvatarURL(),
        url: reaction.message.url
      })
      .setDescription(message.content || ' ')
      .setImage(message.attachments.first()?.url)
      .setFooter({
        text: 'Use this in your own server by using `/skullboard`!'
      })
      .setTitle(`**${reaction.count} :skull:**`);
    const channel = await client.channels.fetch(channelId);
    if (!channel) return;

    const skullBoardMessage = await channel.send({
      embeds: [embed],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setEmoji('💀')
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
