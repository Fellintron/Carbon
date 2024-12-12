const { Message, Client, EmbedBuilder } = require('discord.js');
const userDb = require('../../database/models/user');
const serverDb = require('../../database/models/settingsSchema');

module.exports = {
  name: 'afkset',
  aliases: ['afksettings'],
  usage: '<remove/clear|ignore|ignores> <@user|#channel>',
  category: 'Utility',
  description: 'Change the settings for the `afk` command in your server!',
  async execute(message, args, client) {
    const examples = {
      ignore: `\`ic afkset ignore #${message.channel.name}\``,
      remove: `\`ic afkset clear @${message.author.tag}\` or \`ic afkset clear ${message.author.id}\``,
      ignores: `\`ic afkset ignores\``
    };

    if (
      !args[0] ||
      !['remove', 'ignore', 'clear', 'ignores'].includes(
        args[0].toLocaleLowerCase()
      )
    ) {
      return message.reply(
        `Please provide valid arguments.\n\nIgnore a channeL: ${examples.ignore}\nRemove someone's AFK: ${examples.remove}\nCheck all ignored channels: ${examples.ignores}`
      );
    }

    switch (args[0].toLocaleLowerCase()) {
      case 'ignores':
        const Server = await serverDb.findOne({
          guildID: message.guild.id
        });

        if (!Server || !Server.afkIgnore.length) {
          return message.reply('This server has not ignored any channels!');
        }

        const map = Server.afkIgnore.map((a, i) => `${i + 1}\) <#${a}>`);

        return message.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle('Ignored Channels')
              .setDescription(map.join('\n'))
              .setColor('Yellow')
              .setTimestamp()
          ]
        });

      case 'remove':
      case 'clear':
        args.shift();
        if (!args[0]) {
          return message.reply(
            `Please mention the user or provide their user ID.\n\nExample: ${examples.ignore}`
          );
        }
        let user = message.mentions.users.size
          ? message.mentions.users.first().id
          : args[0];
        try {
          user = await message.guild.members.fetch({
            user
          });
        } catch (s) {
          return message.reply(
            `No user with ID \`${user}\` found in this server!`
          );
        }

        let dbUser = await userDb.findOne({
          userId: user.id
        });
        if (!dbUser || !dbUser?.afk) {
          return message.reply(`${user.toString()} is not AFK!`);
        }
        client.afks = client.afks.filter((a) => a !== user.id);
        dbUser.afk = {};
        dbUser.save();

        return message.reply('Removed their AFK.');

      case 'ignore':
        let server = await serverDb.findOne({
          guildID: message.guild.id
        });

        if (!server) {
          server = new serverDb({
            guildID: message.guild.id,
            afkIgnore: []
          });
        }

        const channel = message.mentions.channels?.first() || message.channel;

        if (server.afkIgnore.includes(channel.id)) {
          server.afkIgnore = server.afkIgnore.filter((a) => a !== channel.id);
          client.afkIgnore = client.afkIgnore.filter((a) => a !== channel.id);
          server.save();
          return message.reply(
            `${channel.toString()} is no longer AFK Ignored.`
          );
        } else {
          if (server.afkIgnore) {
            server.afkIgnore.push(channel.id);
          } else {
            server.afkIgnore = [channel.id];
          }
          client.afkIgnore.push(channel.id);
          server.save();

          return message.reply(`${channel.toString()} is now AFK ignored!`);
        }
    }
  }
};
