const {
  ButtonBuilder,
  ActionRowBuilder,
  EmbedBuilder,
  ButtonStyle
} = require('discord.js');
const prettyMilliseconds = require('pretty-ms');

module.exports = {
  name: 'fastclick',
  category: 'Fights',
  usage: '@opponent',
  description: 'Use your skills to win fights, the fastest to click wins.',
  async execute(message, args, client) {
    const player = message.author;
    const opponent = resolveUser(args.join(' '))

    if (!opponent) {
      return message.channel.send({
        embeds: createErrorEmbed(`You must mention someone to play with them.\n\n**Example:** \`ic fastclick @parrot7702\``)
      });
    }
      
    if (player.id === opponent.id) {
      return message.channel.send({
        embeds: createErrorEmbed(`Please don't play yourself, it's kinda lonely.`)
      })
    }
      
      if (opponent.bot) {
        return message.channel.send({ embeds: createErrorEmbed(`You can't play with bots.`) })
      }

    const accept = new ButtonBuilder()
      .setStyle(ButtonStyle.Success)
      .setCustomId('accept')
      .setLabel('Accept');
      
   const decline = new ButtonBuilder()
      .setStyle(ButtonStyle.Danger)
      .setCustomId('decline')
      .setLabel('Decline');

    const row = new ActionRowBuilder().addComponents([accept, decline]);

    const response = await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('Confirmation')
          .setDescription(
            `${opponent.toString()}, ${player.toString()} has challenged you for a game of fast click.\nWhat do you say?`
          )
          .setTimestamp()
          .setColor('Blurple')
      ],
      components: [row]
    });

    const collector = response.createMessageComponentCollector({
      time: 10 * 60 * 1000
    });

    collector.on('collect', async (interaction) => {
      await interaction.deferUpdate();
      
      if (interaction.user.id !== opponent.id) {
        return interaction.followUp({
          embeds: createWarnEmbed('This interaction is not for you.'),
          ephemeral: true
        });
      }

      if (interaction.customId === 'accept') {
        accept.setDisabled();
        decline.setStyle(ButtonStyle.Secondary)
          .setDisabled();
       
        await interaction.editReply({
          embeds: [
  new EmbedBuilder()
          .setTitle('Request Accepted')
          .setDescription(
            `${player.toString()}, ${opponent.toString()} has accepted your request of playing a **Fast Click** game.`
          )
          .setColor('Green')
          .setTimestamp()
          ],
          components: [row]
        });

        const gameMessage = await interaction.channel.send({
          embeds: createEmbed(`Alright, the buttons will appear in 3 seconds, good luck!`)
        });
        
        const correct = new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel('This one')
          .setCustomId('correct');
          
         const buttons = []
          
          buttons.push(correct)
          
          ['first', 'second', 'third', 'fourth'].forEach(value => {
            buttons.push(new ButtonBuilder().setLabel('No not this').setStyle(ButtonStyle.Secondary).setCustomId(`incorrect_${value}`))
          })
          
        buttons.sort(() => Math.random() - 0.5);
        
        const gameRow = new ActionRowBuilder().addComponents(buttons);
        
        await sleep(3000);
        
        await gameMessage.edit({
          components: [gameRow],
          content: 'Click the green one!'
        });
      
      const gameCollector = gameMessage.createMessageComponentCollector({ time: 10*60*1_000})
      
      gameCollector.on('collect', async button => {
       await button.deferUpdate()
       
  if (![player.id, opponent.id].includes(button.user.id)) {
    return button.followUp({
      embeds: createWarnEmbed('This interaction is not for you.'),
      ephemeral: true
    });
  }

collector.stop()
          gameCollector.stop();

          if (button.customId !== 'correct') {
           
            const loserId = button.user.id;
            const winnerId = loser === player.id ? opponent.id : player.id;
            
            await ({
              components: disableComponents(gameRow),
              embeds: createSuccessEmbed(`:trophy: <@${winnerId}> won because <@${loserId}> clicked the wrong button!`)
            });
          }
          
          const winnerId = button.user.id;
         
          await button.editReply({
            components: disableComponents(mainRow),
            embeds: createSuccessEmbed(`:trophy: <@${winnerId}> has won! The button was clicked in ${prettyMilliseconds(Date.now() - button.createdTimestamp), { verbose: true }}!`)
          });
        });
      } else {
        accept.setStyle(ButtonStyle.Success)
          .setDisabled();
        decline.setDisabled();
        
    await interaction.editReply({
          embeds: [
  new EmbedBuilder()
          .setTitle('Request Declined')
          .setDescription(
            `${player.toString()}, ${opponent.toString()} has declined your request of playing a **Fast Click** game.`
          )
          .setColor('Red')
          .setTimestamp()
          ],
          components: [row]
        });
 }
    });
    
    collector.on('end', () => {
      response.edit({ components: disableComponents(row), content: '*This interaction has expired, please use the command again.*' })
    })
  }
};
