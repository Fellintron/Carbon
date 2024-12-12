const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require('discord.js');

module.exports = {
  name: 'guessthenumber',
  aliases: ['gtn'],
  usage: '<min> <max> <duration>',
  category: 'Fun',
  description: 'Starts a **Guess The Number** game.',
  async execute(message, args, client) {
    if (!args[0])
      return message.reply({
        content:
          'Please provide a lower limit.\n\nThis example will start a **Guess The Number** game from 1-100: `ic gtn 1 100`'
      });

 if (!args[1])
      return message.reply({
        content:
          'Please provide an upper limit.\n\nThis example will start a **Guess The Number** game from 1-100: `ic gtn 1 100`'
      });

    const min = parseInt(args[0]);
    const max = parseInt(args[1]);
    
    if (!min) return message.reply({ content: 'Please provide a valid lower limit.'})
if (!max) return message.reply({ content: 'Please provide a valid upper limit.'})
    
    const randomNumber = message.client.functions.getRandom(min, max);

const startButton =    new ButtonBuilder()
            .setLabel('Start')
            .setStyle(ButtonStyle.Success)
            .setCustomId('start')
const cancelButton =    new ButtonBuilder()
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger)
      .setCustomId('cancel')
      
      const row = new ActionRowBuilder([startButton, cancelButton])
      
    const response = await message.channel.send({
      content: message.author.toString(),
      embeds: [new EmbedBuilder().setDescription(`${message.author.toString()}, do you want to host a **Guess The Number** game (__**Range:**__ ${min}-${max}) now?`).setTimestamp().setColor(Blurple)
      ],
      components: [row]
    });

await response.pin()

    const collector = response.createMessageComponentCollector({
      time: 10 * 15 * 1_000
    });

    collector.on('collect', async (interaction) => {
      await interaction.deferUpdate()
      
      if (interaction.user.id !== message.author.id) return interaction.followUp({ content: 'This interaction is not for you.', ephemeral: true })
      if (interaction.customId === 'cancel') {
        cancelButton.setStyle(ButtonStyle.Secondary).setDisabled()
        startButton.setDisabled()
        
        await interaction.editReply({ components: [row]})
      } else {
   startButton.setStyle(ButtonStyle.Secondary).setDisabled()
   cancelButton.setDisabled()
        
        await interaction.editReply({ components: [row]})
    
        await interaction.followUp({
          content: `The number to be guessed is **${randomNumber}**.`,
          ephemeral: true
        });
        
        await message.channel.send(
          'The channel will be unlocked after 5 seconds and will be automatically locked after someone guesses the number.'
        );
        
        await new Promise(resolve => setTimeout(resolve, 5000));

        message.channel.send('Good luck everyone, channel is now unlocked 🔓.');
        
        message.channel.permissionOverwrites.edit(
          message.guild.roles.everyone,
          {
            SendMessages: true
          }
        );

        const messageCollector = message.channel.createMessageCollector({
          filter: (collected) => collected.content === randomNumber
        });

        messageCollector.on('collect', (collected) => {
          message.channel.permissionOverwrites.edit(
            message.guild.roles.everyone,
            {
              SendMessages: false
            }
          );
          
          messageCollector.stop();
          collected.reply({
            embeds: [
              new EmbedBuilder()
              .setTitle( '🎉 We have our winner')
                .setDescription(`The number to be guessed was **${randomNumber}** and ${m.author.toString()} guessed it!`)
               .setTimestamp()
               .setColor(Blurple)
               .setThumbnail(message.author.displayAvatarURL())
               ]})
          });
        }
    });

    collector.on('end', (reason) => {
        if (reason === 'time') {
       startButton.setDisabled();
       cancelButton.setDisabled();
       
        response.edit({
          components: [row]
        });
      }
    });
  }
};
