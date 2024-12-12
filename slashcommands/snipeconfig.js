const {
  CommandInteraction,
  Client,
  EmbedBuilder,
  italic,
  SlashCommandBuilder
} = require('discord.js');
const SETTINGS = require('../database/models/settingsSchema');
module.exports = {
  global: true,
  data: new SlashCommandBuilder()
    .setName('snipe-config')
    .setDescription('Configure the snipe settings for your server')
    .addSubcommandGroup((group) => {
      return group
        .setName('allowed-role')
        .setDescription('Roles which can use the snipe command')
        .addSubcommand((cmd) => {
          return cmd
            .setName('list')
            .setDescription(
              'View all the roles that can run the `ic snipe` and `ic editsnipe` command.'
            );
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('add')
            .setDescription('Add a role.')
            .addRoleOption((option) => {
              return option 
                .setName('role')
                .setDescription('The role you want to add.');
            });
        })
        .addSubcommand((cmd) => {
          return cmd
            .setName('remove')
            .setDescription('Remove a role.')
            .addRoleOption((o) => {
              return o
                .setName('role')
                .setDescription('The role you want to remove.');
            });
        });
    })
    .addSubcommand((g) => {
      return g
        .setName('toggle')
        .setDescription('Turn off/on snipes and esnipes in your server.');
    }),
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply(
        'You need the `Administrator` permission to run this command.'
      );
    }
    let server = await SETTINGS.findOne({
      guildID: interaction.guild.id
    });
    if (!server) {
      server = new SETTINGS({
        guildID: interaction.guild.id
      });
    }
    if (interaction?.options.getSubcommand() == 'toggle') {
      if (server.snipeConfig?.enabled) {
        server.snipeConfig.enabled = false;
      } else {
        server.snipeConfig.enabled = true;
      }
      server.save();

      return interaction.reply(
        `Snipes are now **${
          server.snipeConfig.enabled ? 'enabled' : 'disabled'
        }** for this server.`
      );
    }

    const group = interaction.options?.getSubcommandGroup();

    if (group === 'allowed-role') {
      const command = interaction.options.getSubcommand();
      if (!server.snipeConfig?.allowedRoles) {
        server.snipeConfig.allowedRoles = [];
      }
      if (command == 'list') {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Snipe whitelist roles')
              .setDescription(
                'You can change these roles by using /snipe-config.'
              )
              .addFields(
                'Roles',
                server.snipeConfig.allowedRoles
                  .map((v, i) => `${i + 1}. <@&${v}>`)
                  .join('\n') || italic('No snipe whitelist roles configured for this server.')
              )
              .setColor('Random')
          ]
        });
      } else if (command == 'add') {
        const role = interaction.options.getRole('role');

        if (server.snipeConfig.allowedRoles.includes(role.id)) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(`${role.toString()} is already in the list.`)
                .setColor('Red')
            ]
          });
        }
        server.snipeConfig.allowedRoles.push(role.id);
        server.save();

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Snipe whitelist role')
              .setDescription(`Added ${role.toString()} to the snipe whitelist.`)
              .setColor('Green')
              .setFooter({
                text: 'You can check the list via /snipe-config allowed-role list'
              })
          ]
        });
      } else if (command == 'remove') {
        const role = interaction.options.getRole('role');

        if (!server.snipeConfig.allowedRoles.includes(role.id)) {
          return interaction.reply({
            embeds: [
              new EmbedBuilder()
                .setDescription(
                  `${role.toString()} is not a snipe whitelisted role.`
                )
                .setColor('Red')
            ]
          });
        }
        server.snipeConfig.allowedRoles =
          server.snipeConfig.allowedRoles.filter((r) => r !== role.id);
        server.save();

        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Snipe Whitelist Role')
              .setDescription(`Removed ${role.toString()} from the list!`)
              .setColor('Red')
              .setFooter({
                text: 'You can check the list via /snipe-config allowed-role list'
              })
          ]
        });
      }
    }
  }
};
