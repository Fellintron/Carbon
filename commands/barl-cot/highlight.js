const { Message, Client, EmbedBuilder } = require('discord.js');
const UserDB = require('../../database/models/user');
module.exports = {
  name: 'highlight',
  aliases: ['hl'],
  usage: '<add/remove/list> <highlight>',
  description: "Carl bot's highlight feature.",
  fhOnly: true,
  subcommands: ['add', 'remove', 'list', '+', '-'],
  /**
   * @param {Message} message
   * @param {String[]} args
   * @param {Client} client
   */
  async execute(message, args, client) {
    const example = `\n\nExample: \`fh hl add hrish\`, \`fh hl remove felli\` & \`fh hl list\``;
    /**
     * boring
     * stuff
     * like
     * checking
     * perms
     * goes
     * here
     * yuh
     */
    const roles = [
      '824687430753189902',
      '828048225096826890',
      '825283097830096908',
      '839803117646512128',
      '997919482934734909',
      '999911967319924817',
      '824539655134773269'
    ];
    if (!message.member.roles.cache.hasAny(...roles))
      return message.reply(
        `You cannot run this command! Check <#843943148945276949> for more info!`
      );
    const action = args[0];
    if (!action) {
      return message.reply('You must tell me what to do!' + example);
    }
    if (!this.subcommands.includes(action)) {
      return message.reply('Not a valid option.' + example);
    }
    let dbUser = await UserDB.findOne({
      userId: message.author.id
    });
    if (!dbUser) {
      dbUser = new UserDB({
        userId: message.author.id,
        highlight: {
          words: []
        }
      });
    }
    if (action == 'list') {
      let data = '';
      if (!dbUser.highlight || !dbUser.highlight.words.length) {
        data = 'You have no words highlighted.';
      }
      let i = 1;
      for (const word of dbUser.highlight.words) {
        data += `${i}: ${word}\n`;

        i++;
      }

      const embed = new EmbedBuilder({
        title: 'Highlight List',
        description: data
      });

      return await message.reply({
        embeds: [embed]
      });
    }

    if (['+', 'add'].includes(action)) {
      args.shift();
      const word = args.join(' ');
      if (!word) {
        return message.reply('Please provide the word you want to highlight.');
      }
      if (word.length < 3) {
        return message.reply(`The word must be atleast 3 characters long.`);
      }
      if (dbUser.highlight && dbUser.highlight.words) {
        const hasWord = dbUser.highlight.words.filter(
          (a) => a && a.includes(word.toLowerCase())
        );
        if (
          dbUser.highlight.words.includes(word.toLowerCase()) ||
          hasWord.length
        ) {
          return message.reply('This word is already highlighted!');
        }
        dbUser.highlight.words.push(word.toLowerCase());
      } else {
        dbUser.highlight = {
          words: [word.toLowerCase()]
        };
      }
      dbUser.save();
      if (!client.db.hl.all.includes(word.toLowerCase())) {
        client.db.hl.all.push(word.toLowerCase());
      }
      if (client.db.hl.db.some((a) => a.userId === message.author.id)) {
        client.db.hl.db
          .find((a) => a.userId === message.author.id)
          .highlight.words.push(word.toLowerCase());
      } else {
        client.db.hl.db.push(dbUser);
      }
      return message.reply(
        `\`${word.toLowerCase()}\` has been added to your HL.`
      );
    } else if (['remove', '-'].includes(action)) {
      args.shift();
      const word = args.join(' ');
      if (!word)
        return message.reply('Provide the word you want me to remove.');

      if (
        !dbUser.highlight ||
        !dbUser.highlight.words.length ||
        !dbUser.highlight.words.includes(word.toLowerCase())
      ) {
        return message.reply('That word is not in your HL list.');
      }
      dbUser.highlight.words = dbUser.highlight.words.filter(
        (a) => a.toLowerCase() !== word.toLowerCase()
      );
      dbUser.save();
      client.db.hl.db.find(
        (a) => a.userId === message.author.id
      ).highlight.words = client.db.hl.db
        .find((a) => a.userId === message.author.id)
        .highlight.words.filter((a) => a !== word.toLowerCase());
      return message.react('☑️');
    }
  }
};
