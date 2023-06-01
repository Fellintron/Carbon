const {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder
} = require('discord.js');
const Database = require('../database/models/fellowship');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('fellowship')
    .setDescription('Manage fellowships')
    .addSubcommand((cmd) => {
      return cmd
        .setName('create')
        .setDescription('Create a new fellowship.')
        .addChannelOption((o) => {
          return o
            .addChannelType(0)
            .setRequired(true)
            .setName('channel')
            .setDescription(
              'The channel which you want to bind the fellowship with.'
            );
        })
        .addUserOption((o) => {
          return o
            .setName('owner_1')
            .setDescription('Owner 1 of the fellowship')
            .setRequired(true);
        })
        .addNumberOption((n) => {
          return n
            .setName('owner_1_invites')
            .setDescription('Number of invites Owner 1 has.')
            .setRequired(true);
        })
        .addUserOption((o) => {
          return o
            .setName('owner_2')
            .setDescription('Owner 2 of the fellowship')
            .setRequired(true);
        })
        .addNumberOption((n) => {
          return n
            .setName('owner_2_invites')
            .setDescription('Number of invites Owner 1 has.')
            .setRequired(true);
        })
        .addUserOption((o) => {
          return o
            .setName('owner_3')
            .setDescription('Owner 3 of the fellowship')
            .setRequired(true);
        })
        .addNumberOption((n) => {
          return n
            .setName('owner_3_invites')
            .setDescription('Number of invites Owner 1 has.')
            .setRequired(true);
        });
    })
    .addSubcommand((cmd) => {
      return cmd
        .setName('add')
        .setDescription('Add someone to your fellowship.')
        .addChannelOption((c) => {
          return c
            .setName('fellowship')
            .setDescription(
              'Choose your fellowship channel (Fellowship Owners Only)'
            )
            .setRequired(true);
        })
        .addUserOption((o) => {
          return o
            .setName('user')
            .setDescription('Mention the user you want to add.')
            .setRequired(true);
        });
    })
    .addSubcommand((cmd) => {
      return cmd
        .setName('remove')
        .setDescription('Remove someone from your fellowship.')
        .addChannelOption((c) => {
          return c
            .setName('fellowship')
            .setDescription(
              'Choose your fellowship channel (Fellowship Owners Only)'
            )
            .setRequired(true);
        })
        .addUserOption((o) => {
          return o
            .setName('user')
            .setDescription('Mention the user you want to remove.')
            .setRequired(true);
        });
    })
    .addSubcommand((cmd) => {
      return cmd
        .setName('update_invites')
        .setDescription(
          'Admins only: Change the number of invites someone has!'
        )
        .addChannelOption((c) => {
          return c
            .setName('fellowship')
            .setDescription('The channel to which the fellowship belongs.')
            .setRequired(true);
        })
        .addUserOption((a) => {
          return a
            .setName('owner')
            .setDescription('The owner whose invites you want to change.')
            .setRequired(true);
        })
        .addNumberOption((a) => {
          return a
            .setName('invites')
            .setDescription('New number of invites for the user.')
            .setRequired(true);
        });
    })
    .addSubcommand((cmd) => {
      return cmd
        .setName('view')
        .setDescription('Get info about a fellowship.')
        .addChannelOption((c) => {
          return c
            .setName('fellowship')
            .setDescription('The channel to which the fellowship belongs.')
            .setRequired(true);
        });
    })
    .addSubcommand((cmd) => {
      return cmd
        .setName('clear_invites')
        .setDescription('Clear your fellowship invites.')
        .addChannelOption((c) => {
          return c
            .setName('channel')
            .setDescription('Your fellowship channel.')
            .setRequired(true);
        });
    }),
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const command = interaction.options.getSubcommand();

    if (command === 'create') {
      if (
        !interaction.member.roles.cache.some(
          (role) => role.id === '1016728636365209631' // comm manager role id
        ) &&
        !interaction.member.roles.cache.some(
          (role) => role.id === '824348974449819658' // admin role id
        ) &&
        interaction.author.id !== '786150805773746197' // my id
      ) {
        return interaction.reply({
          content: "Contact a community manager+, you can't use this",
          ephemeral: true
        });
      }

      const data = {
        channel: interaction.options.getChannel('channel'),
        owner1: interaction.options.getUser('owner_1'),
        owner2: interaction.options.getUser('owner_2'),
        owner3: interaction.options.getUser('owner_3'),
        owner1Invites: interaction.options.getNumber('owner_1_invites'),
        owner2Invites: interaction.options.getNumber('owner_2_invites'),
        owner3Invites: interaction.options.getNumber('owner_3_invites')
      };

      const exists = await Database.findOne({
        channelId: data.channel.id
      });
      if (exists) {
        return interaction.reply(
          'A fellowship for that channel already exists!'
        );
      }
      const amogus = new Database({
        guildId: interaction.guild.id,
        channelId: data.channel.id,
        ownerIds: [data.owner1.id, data.owner2.id, data.owner3.id],
        owners: {
          one: {
            userId: data.owner1.id,
            invites: data.owner1Invites,
            invited: []
          },
          two: {
            userId: data.owner2.id,
            invites: data.owner2Invites,
            invited: []
          },
          three: {
            userId: data.owner3.id,
            invites: data.owner3Invites,
            invited: []
          }
        }
      }).save();
      for (const sus of [data.owner1.id, data.owner2.id, data.owner3.id]) {
        data.channel.permissionOverwrites.edit(sus, {
          ViewChannel: true,
          SendMessages: true
        });
      }
      data.channel.send(
        `${[data.owner1.id, data.owner2.id, data.owner3.id]
          .map((a) => `<@${a}>`)
          .join(
            ' '
          )}\n\n${interaction.user.toString()} has created your fellowship! You are the owners and here is how you can add/remove members from your fellowship:\n\nTo add: /fellowship add\nTo remove: /fellowship remove`
      );
      return interaction.reply(`☑ Fellowship has been created.`);
    } else if (command === 'update_invites') {
      if (
        !interaction.member.roles.cache.some(
          (role) => role.id === '1016728636365209631' // comm manager role id
        ) &&
        !interaction.member.roles.cache.some(
          (role) => role.id === '824348974449819658' // admin role id
        ) &&
        interaction.author.id !== '786150805773746197' // my id
      ) {
        return interaction.reply({
          content: "Contact a community manager+, you can't use this",
          ephemeral: true
        });
      }

      const data = {
        channel: interaction.options.getChannel('fellowship'),
        owner: interaction.options.getUser('owner'),
        invites: interaction.options.getNumber('invites')
      };

      const fellowship = await Database.findOne({
        channelId: data.channel.id
      });

      const dbUser =
        fellowship.owners.one.userId == data.owner.id
          ? fellowship.owners.one
          : fellowship.owners.two.userId == data.owner.id
          ? fellowship.owners.two
          : fellowship.owners.three;

      dbUser.invites = data.invites;
      fellowship.save();

      return interaction.reply(
        `<@${dbUser.userId}> now has **\`${dbUser.invites}\`** invites!`
      );
    } else if (command === 'add') {
      const data = {
        channel: interaction.options.getChannel('fellowship'),
        user: interaction.options.getUser('user')
      };
      const fellowship = await Database.findOne({
        channelId: data.channel.id
      });
      if (!fellowship)
        return interaction.reply({
          content: "That's not even a valid fellowship."
        });

      const owner = fellowship.ownerIds.includes(interaction.user.id);
      if (!owner)
        return interaction.reply('You are not an owner of that fellowship!');

      const dbUser =
        fellowship.owners.one.userId == interaction.user.id
          ? fellowship.owners.one
          : fellowship.owners.two.userId == interaction.user.id
          ? fellowship.owners.two
          : fellowship.owners.three;

      if (dbUser.invited.length == dbUser.invites) {
        return interaction.reply({
          content: `You have already reached your max invites. (${dbUser.invites})`
        });
      }
      if (dbUser.invited.includes(data.user.id))
        return interaction.reply(
          'That user is already a part of your fellowship!'
        );
      dbUser.invited.push(data.user.id);
      await interaction.guild.channels.cache
        .get(fellowship.channelId)
        .permissionOverwrites.edit(data.user.id, {
          ViewChannel: true,
          SendMessages: true
        });
      fellowship.save();

      interaction.reply(
        `Done! Added ${data.user.toString()} to your fellowship ${data.channel.toString()}`
      );
    } else if (command === 'remove') {
      const data = {
        channel: interaction.options.getChannel('fellowship'),
        user: interaction.options.getUser('user')
      };
      const fellowship = await Database.findOne({
        channelId: data.channel.id
      });
      if (!fellowship)
        return interaction.reply({
          content: "That's not even a valid fellowship."
        });

      const owner = fellowship.ownerIds.includes(interaction.user.id);
      if (!owner)
        return interaction.reply('You are not an owner of that fellowship!');

      const dbUser =
        fellowship.owners.one.userId == interaction.user.id
          ? fellowship.owners.one
          : fellowship.owners.two.userId == interaction.user.id
          ? fellowship.owners.two
          : fellowship.owners.three;

      if (!dbUser.invited.includes(data.user.id))
        return interaction.reply('That user is not a part of your fellowship!');
      dbUser.invited = dbUser.invited.filter((a) => a !== data.user.id);
      await interaction.guild.channels.cache
        .get(fellowship.channelId)
        .permissionOverwrites.edit(data.user.id, {
          ViewChannel: false,
          SendMessages: false
        });
      fellowship.save();

      interaction.reply(
        `Done! Removed ${data.user.toString()} from your fellowship ${data.channel.toString()}!`
      );
    } else if (command == 'clear_invites') {
      const data = {
        channel: interaction.options.getChannel('channel')
      };
      const fellowship = await Database.findOne({
        channelId: data.channel.id
      });
      if (!fellowship)
        return interaction.reply({
          content: "That's not even a valid fellowship."
        });

      const owner = fellowship.ownerIds.includes(interaction.user.id);
      if (!owner)
        return interaction.reply('You are not an owner of that fellowship!');

      const dbUser =
        fellowship.owners.one.userId == interaction.user.id
          ? fellowship.owners.one
          : fellowship.owners.two.userId == interaction.user.id
          ? fellowship.owners.two
          : fellowship.owners.three;

      const allInvites = dbUser.invited;
      allInvites.forEach((invite) => {
        data.channel.permissionOverwrites.delete(invite);
      });
      dbUser.invited = [];
      fellowship.save();
      return interaction.reply('Your invites have been cleared.');
    } else if (command == 'view') {
      const channel = interaction.options.getChannel('fellowship');

      const dbChannel = await Database.findOne({
        channelId: channel.id
      });
      if (!dbChannel)
        return interaction.reply('There is no fellowship for that channel.');

      const embed = new EmbedBuilder()
        .setTitle('Fellowship')
        .setDescription('Here are the details for this fellowship.')
        .addFields([
          {
            name: `Owner 1: ${await (
              await interaction.client.users.fetch(dbChannel.owners.one.userId)
            ).tag}`,
            value: `**__Invites:__**(${
              dbChannel.owners.one.invited.length
            }/${dbChannel.owners.one.invites.toString()})\n${dbChannel.owners.one.invited
              .map((a, b) => `${b + 1}: <@${a}>`)
              .join('\n')}`,
            inline: false
          }
        ])
        .addFields([
          {
            name: `Owner 2: ${await (
              await interaction.client.users.fetch(dbChannel.owners.two.userId)
            ).tag}`,
            value: `**__Invites:__**(${
              dbChannel.owners.two.invited.length
            }/${dbChannel.owners.two.invites.toString()})\n${dbChannel.owners.two.invited
              .map((a, b) => `${b + 1}: <@${a}>`)
              .join('\n')}`,
            inline: false
          }
        ])
        .addFields([
          {
            name: `Owner 3: ${await (
              await interaction.client.users.fetch(
                dbChannel.owners.three.userId
              )
            ).tag}`,
            value: `**__Invites:__**(${
              dbChannel.owners.three.invited.length
            }/${dbChannel.owners.three.invites.toString()})\n${dbChannel.owners.three.invited
              .map((a, b) => `${b + 1}: <@${a}>`)
              .join('\n')}`,
            inline: false
          }
        ])
        .setColor('Green')
        .setTimestamp();

      await interaction.reply({
        embeds: [embed]
      });
    }
  }
};
