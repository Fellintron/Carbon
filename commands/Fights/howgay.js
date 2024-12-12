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
    const target = message.mentions?.users?.first();

    if (!target) {
      return message.channel.send('You must ping someone to play with them.');
    }

    const getRate = () => Math.floor(Math.random() * 101);

    let gamedata = {
      players: {
        one: message.member,
        two: message.mentions.members.first(),
        oneR: getRate(),
        twoR: getRate()
      }
    };
    args.shift();

    const type = args[0]?.toLocaleLowerCase() || null;

    if (!type || !['low', 'high', 'l', 'h'].includes(type)) {
      return message.reply(
        `You must specify the type of fight! Either HIGH or LOW (high/low/h/l).`
      );
    }

    gamedata.type = type.includes('h') ? 'high' : 'low';

    const confirmationMessage = await message.channel.send({
      content: `${target.toString()} do you want to play a game of HowGay with ${message.author.toString()}?`,
      embeds: [
        new EmbedBuilder()
          .setTitle(`Confirmation`)
          .setDescription(
            'Use the button to make your choice.\nYou have 10 minutes'
          )
          .setColor(Blurple)
      ],
      components: [
        new ActionRowBuilder().addComponents([
          new ButtonBuilder()
            .setLabel('Accept')
            .setStyle(ButtonStyle.Success)
            .setCustomId('accept-hg'),
          new ButtonBuilder()
            .setLabel('Deny')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('deny-hg')
        ])
      ]
    });

    const collector = confirmationMessage.createMessageComponentCollector({
      time: 10 * 60 * 1000
    });

    collector.on('collect', async (button) => {
      if (button.user.id !== target.id) {
        return button.reply({
          content: ':warning: This interaction is not for you.',
          ephemeral: true
        });
      }

      if (button.customId.includes('accept')) {
        confirmationMessage.edit({
          embeds: [],
          content: 'This request was ACCEPTED.',
          components: []
        });
      }

      const mainMessage = await message.channel.send({
        embeds: [
          new EmbedBuilder().setTitle('Starting game...').setColor(Blurple)
        ]
      });

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const embed = new EmbedBuilder()
        .setTitle(`Howgay | ${target.tag} VS ${message.author.tag}`)
        .setDescription(
          `The one with the ${
            gamedata.type == 'high' ? '**highest**' : '**lowest**'
          } rate wins!`
        )
        .addFields(
          {
            name: `${gamedata.players.one.user.tag}`,
            value: `Rate: ${gamedata.players.oneR}`,
            inline: true
          },
          {
            name: `${gamedata.players.two.user.tag}`,
            value: `Rate: ${gamedata.players.twoR}`,
            inline: true
          }
        )
        .setColor(Blurple)
        .setFooter({
          text: 'gg'
        });

      const sentMessage = await message.channel.send({
        embeds: [embed]
      });

      const highScore = Math.max(gamedata.players.oneR, gamedata.players.twoR);
      const lowScore = Math.min(gamedata.players.oneR, gamedata.players.twoR);

      let winner;
      if (gamedata.type === 'high') {
        winner =
          gamedata.players.oneR === highScore
            ? gamedata.players.one
            : gamedata.players.two;
      } else {
        winner =
          gamedata.players.oneR === lowScore
            ? gamedata.players.one
            : gamedata.players.two;
      }

      if (gamedata.players.oneR === gamedata.players.twoR) {
        await sentMessage.edit({
          embeds: [
            embed.setDescription('It was a tie!').setColor('Random').setFooter({
              text: 'Better luck next time!'
            })
          ]
        });
      } else {
        await sentMessage.edit({
          embeds: [
            embed
              .setDescription(
                `${winner.user.tag} won with ${
                  winner === gamedata.players.one
                    ? gamedata.players.oneR
                    : gamedata.players.twoR
                } points!`
              )
              .setColor('Random')
              .setFooter({
                text: `Congratulations ${winner.user.tag}!`
              })
          ]
        });
      }
    });
  }
};
