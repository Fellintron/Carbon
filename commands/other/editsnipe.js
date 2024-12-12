const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle
} = require('discord.js');
const guildSchema = require('../../database/models/settingsSchema');

module.exports = {
  name: 'snipe',
  category: 'Moderation',
  description: 'Snipe edited sniped messages',
  async execute(message, args, client) {
    const editSnipedMessages = client.editSnipedMessages.get(
      message.channel.id
    );

    const data = await guildSchema.findOne({
      guildID: message.guild.id
    });

    if (!data || !data?.snipeConfig?.allowedRoles?.length) {
      return message.reply(
        'This server has not yet setup the snipe feature.\nPlease ask an Administrator to run `/snipe-config`.'
      );
    }

    if (!data?.snipeConfig?.enabled) {
      return message.reply(
        'Snipes are disabled in this server.\nPlease ask an Administrator to run /snipe-config.'
      );
    }

    if (
      data?.snipeConfig?.allowedRoles.length &&
      !message.member.roles.cache.hasAny(...data?.snipeConfig?.allowedRoles)
    ) {
      return message.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('No permission')
            .setColor('Red')
            .setDescription(
              `You need to have one of the following roles to use this command:\n${server?.snipeConfig?.allowedRoles
                .map((role) => `- <@&${a}>`)
                .join('\n')}`
            )
            .setTimestamp()
        ]
      });
    }

    if (!edtiSnipedMessages) {
      return message.channel.send('There is nothing to snipe.');
    }

    let index = parseInt(args[0]) - 1;
    index ??= 0;

    function getResponse({ index, disabled= false}) {
      const {
        oldContent,
        newContent,
        author,
        createdTimestamp,
        editedTimestamp,
        oldAttachmentURL,
        newAttachmentURL
      } = editSnipedMessages[index];

      const oldMessageEmbed = new EmbedBuilder()
        .setTitle('Old Message')
        .setAuthor({
          name: author.username,
          iconURL: author.displayAvatarURL()
        })
        .setColor('Blurple')
        .setFooter({ text: `${index + 1}/${editSnipedMessages.length}` })
        .setImage(oldAttachmentURL)

      if (oldContent) oldMessageEmbed.setDescription(oldContent);

      const newMessageEmbed = new EmbedBuilder()
        .setTitle('New Message')
        .setAuthor({
          name: author.username,
          iconURL: author.displayAvatarURL()
        })
        .setColor('Blurple')
        .setFooter({ text: `${index + 1}/${editSnipedMessages.length}` })
        .setImage(newAttachmentURL)

      if (newContent) newMessageEmbed.setDescription(newContent);

   const firstButton = new ButtonBuilder()
        .setEmoji({ name: '⏩' })
        .setCustomId('first')
        .setStyle(ButtonStyle.Success)
        .setDisabled(disabled || index === 0);
   
      const previousButton = new ButtonBuilder()
        .setEmoji('911971090954326017')
        .setCustomId('previous')
        .setStyle(ButtonStyle.Success)
        .setDisabled(disabled || index === 0);
        
      const deleteButton = new ButtonBuilder()
        .setEmoji('🗑')
        .setCustomId('delete')
        .setStyle(ButtonStyle.Primary)
        .setDisabled(disabled);
      const nextButton = new ButtonBuilder()
        .setEmoji('911971202048864267')
        .setCustomId('next')
        .setStyle(ButtonStyle.Success)
        .setDisabled(disabled || editSnipedMessages.length);
        
  const lastButton = new ButtonBuilder()
        .setEmoji({ name: '⏪' })
        .setCustomId('last')
        .setStyle(ButtonStyle.Success)
        .setDisabled(disabled || editSnipedMessages.length);

      const row = new ActionRowBuilder().addComponents([
        firstButton,
        previousButton,
        deleteButton,
        nextButton,
        lastButton
      ]);

      return {
        content: `**__Sent at:__** <t:${(createdTimestamp / 1000).toFixed()}:R>\n**__Edit at:__ <t:${(editedTimestamp / 1000).toFixed()}:R>`,
        embeds:
     [oldMessageEmbed, newMessageEmbed] , components: [row]};
    }

   
    const response = await message.channel.send(getResponse({index}));

    const collector = response.createMessageComponentCollector({
      time: 10 * 60 * 1000
    });

    collector.on('collect', async (interaction) => {
      await interaction.deferUpdate();

      if (interaction.user.id !== message.author.id) {
        return interaction.followUp({
          ephemeral: true,
          content: 'This interaction is not for you.'
        });
      }

      const id = interaction.customId;
      if (id === 'previous') {
        index--;
        if (index < 0) {
          index = 0;
        }

        await interaction.editReply(getResponse({index}));
      } else if (id === 'next') {
        index++;
        if (
          index > editSnipedMessages.length ||
          index == editSnipedMessages.length
        ) {
          index = editSnipedMessages.length - 1;
        }

        await interaction.editReply(getResponse({index}));
      }  else if (id === 'first') {
        index = 0
        await interaction.editReply(getResponse({index}))
      } else if (id === 'last') {
        index = editSnipedMessages.length
        await interaction.editReply(getResponse({ index }))
      }
      else if (id === 'delete') {
        await response.delete();
      }
    });

    collector.on('end', async () => {
      await response.edit(getResponse({index, disabled: true }));
    });
  }
};
