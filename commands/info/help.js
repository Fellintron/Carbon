const prefix = 'fh ';
const {
  Message,
  Client,
  EmbedBuilder,
  SelectMenuBuilder,
  ActionRowBuilder,
  SelectMenuInteraction
} = require('discord.js');
module.exports = {
  name: 'help',
  description: 'Help command',
  category: 'Other',
  /**
   * @param {Message} message
   * @param {Client} client
   * @param {String[]} args
   */
  async execute(message, args, client) {
    if (args[0]) {
      const command =
        client.c.commands.find(
          (c) =>
            c.name == args[0].toLowerCase() ||
            (c.aliases && c.aliases.includes(args[0].toLowerCase()))
        ) ||
        client.c.slashCommands.find(
          (c) => c.data.name == args[0].toLowerCase()
        );
      if (!command) {
        return message.reply(
          `No command \`${args[0].toLocaleLowerCase()}\` found.`
        );
      }
      const embed = new EmbedBuilder()
        .setTitle(command.name || command?.data.name)
        .setColor('Random');
      if (command.data) {
        embed.setTitle(`<:slash_command:1003221544203468820> ${embed.title}`);
        embed.setDescription(command.data.description).setFooter({
          text: 'This command is a slash command'
        });
      } else {
        if (command.description) {
          embed.setDescription(
            command.description || command?.data.description
          );
        }
        if (command.aliases) {
          embed.addFields([
            {
              name: 'Aliases',
              value: command.aliases.map((c) => `**\`${c}\`**`).join(', ')
            }
          ]);
        }
        if (command.usage) {
          embed.addFields([
            {
              name: 'Usage',
              value: `\`\`\`yaml\nfh ${command.name} ${command.usage}\`\`\``
            }
          ]);
        }
        if (command.fhOnly) {
          embed.setFooter({
            text: 'Note: This command can only be used in FightHub!'
          });
        }
      }

      return message.reply({
        embeds: [embed]
      });
    }
    const embed = new EmbedBuilder()
      .setTitle('❓ Help Command')
      .setColor('Green')
      .setDescription(`Select a Category to see the commands!`)
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter({
        text: 'Use fh help [command/alias] for more info!'
      });

    const selection = new SelectMenuBuilder()
      .setPlaceholder('Choose a Category...')
      .setCustomId('help-menu')
      .setOptions([
        {
          label: 'Fights',
          value: 'select-Fights',
          description: 'All commands related to Fighting!',
          emoji: '👊'
        },
        {
          label: 'Donations',
          value: 'select-Donation',
          description: 'Donation commands that help your server!',
          emoji: '💵'
        },
        {
          label: 'Fun',
          value: 'select-Fun',
          description: 'Fun commands to try out!',
          emoji: '🎈'
        },
        {
          label: 'Developer',
          value: 'select-Developer',
          description: "Chances are, you can't use any of these commands.",
          emoji: '👩‍💻'
        },
        {
          label: 'Giveaways',
          value: 'select-Giveaways',
          description: 'Commands that handle giveaways in your server.',
          emoji: '🎉'
        },
        {
          label: 'Utility',
          value: 'select-Utility',
          description: 'Commands that might help you.',
          emoji: '⚙'
        },
        {
          label: 'Other',
          value: 'select-Other',
          description: "Hrish didn't know where these commands go",
          emoji: '📚'
        }
      ])
      .setMaxValues(1)
      .setMinValues(1);

    const mainMessage = await message.channel.send({
      embeds: [embed],
      components: [new ActionRowBuilder().addComponents([selection])]
    });

    const mainCollector = mainMessage.createMessageComponentCollector({
      time: 60 * 1000 * 2,
      filter: (u) => u.user.id === message.author.id
    });

    mainCollector.on('collect', async (select) => {
      const value = select.values[0];
      const category = value.replace('select-', '');
      const commands = {
        legacy: client.c.commands.filter(
          (c) => c.category && c.category === category
        ),
        slash: client.c.slashCommands.filter(
          (c) => c.category && c.category === category
        )
      };

      select.deferUpdate();

      embed.setFields([
        {
          name: 'Legacy Commands',
          value:
            commands.legacy.map((c) => `\`${c.name}\` `).join(', ') ||
            'No commands here!',
          inline: false
        },
        {
          name: 'Slash Commands',
          value:
            commands.slash.map((c) => `\`${c.data.name}\` `).join(', ') ||
            'No commands here!',
          inline: false
        }
      ]);
      select.message.edit({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents([selection])]
      });
    });
  }
};
