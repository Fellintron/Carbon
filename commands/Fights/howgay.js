const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

module.exports = {
  name: 'howgay',
  category: 'Fights',
  args: true,
  usage: '<user> <high / low>',
  description: "Dank Memer's howgay Ice Café method, but its automatic!",
  async execute(message, args, client) {
    const challenger = message.author
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

const challengerRate = getRate()
const opponentRate = getRate()
    
    function getRate() {
     return Math.floor(Math.random() * 101);
    }
  
    let type = args[1]?.toLocaleLowerCase()

    if (!type || !['low', 'high', 'l', 'h'].includes(type)) {
      return message.reply({
        embeds: createErrorEmbed(`You must specify the type of fight! Either HIGH or LOW (high/low/h/l).`)
      });
    }

   type = type.includes('h') ? 'high' : 'low';

  const accept=       new ButtonBuilder()
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success)
            .setCustomId('accept')
      const decline =    new ButtonBuilder()
            .setLabel('Decline')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('decline')
        
    const row = new ActionRowBuilder().addComponents([accept, decline])
    
    const response = await message.channel.send({
      content: `${opponent.toString()}, do you want to play a game of **How Gay** with ${challenger.toString()}?`,
      embeds: [
        new EmbedBuilder()
          .setTitle(`Confirmation`)
          .setDescription(
            'Use the button to make your choice.\nYou have 30 minutes'
          )
          .setColor('Blurple')
      ],
      components: [ row ]
    });

    const collector = confirmationMessage.createMessageComponentCollector({
      time: 30 * 60 * 1000
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
        accept.setStyle(ButtonStyle.Secondary).setDisabled()
        decline.setDisabled()
        
        await interaction.editReply({
         content: createSuccessEmbed('This request was **ACCEPTED**.'),
          components: [row]
        });
      

      const gameMessage = await interaction.channel.send({
        embeds: createEmbed('Starting game...')
      });

      sleep(5000)

      const embed = new EmbedBuilder()
        .setTitle(`How Gay | ${opponent.username} VS ${challenger.username}`)
        .setDescription(
          `The one with the ${type == 'high' ? '**highest**' : '**lowest**'
          } rate wins!`
        )
        .addFields(
          {
            name: challenger.username,
            value: `Rate: ${challengerRate}`,
            inline: true
          },
          {
            name: opponent.username,
            value: `Rate: ${opponentRate}`,
            inline: true
          }
        )
        .setColor('Blurple')

      const sentMessage = await interaction.channel.send({
        embeds: [embed]
      });

      const highScore = Math.max(challengerRate, opponentRate);
      const lowScore = Math.min(challengerRate, opponentRate);

      let winner;
      if (type === 'high') {
        winner =
          challengerRate === highScore
            ? challenger
            : opponent;
      } else {
        winner =
          challengerRate === lowScore
            ? challenger
            : opponent;
      }

      if (challengerRate === opponentRate) {
        await sentMessage.edit({
          embeds: [
            embed.setDescription('It was a tie!').setColor('Blurple').setFooter({
              text: 'Better luck next time!'
            }).setTimestamp()
          ]
        });
      } else {
        await sentMessage.edit({
          embeds: [
            embed
              .setDescription(
                `${winner.username} won with ${
                  winner.id === challenger.id
                    ? challengerRate : opponentRate} points!`
              )
              .setColor('Green')
              .setTitle(
                `🎉 Congratulations ${winner.username}!`
              )
              .setTimestamp()
          ]
        });
      } } else {
    decline.setStyle(ButtonStyle.Secondary).setDisabled()
        accept.setDisabled()
        
        await interaction.editReply({
         content: createErrorEmbed('This request was **DECLINED**.'),
          components: [row]
        });
    
      }
    });
    
    collector.on('end', () => {
      accept.setDisabled()
      decline.setDisabled()
      
      response.edit({ components: [row], content: `*This interaction has expired, please use the command again.*` })
    })
  }
};
