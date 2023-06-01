const { Message, EmbedBuilder } = require('discord.js');
const itemsDb = require('../../database/models/itemSchema');
const db = require('../../node_modules/discord-messages/models/messages');
module.exports = {
  name: 'log-this',
  aliases: ['logthis'],
  usage: '<@USER>',
  /**
   * @param {Message} message
   * @param {String[]} args
   */
  async execute(message, args) {
    const modRoles = [
      '824348974449819658',
      '824539655134773269',
      '825783847622934549',
      '858088054942203945'
    ];
    if (!message.member.roles.cache.hasAny(...modRoles)) {
      return message.reply("You can't use this command bozo");
    }

    if (!message.reference) {
      return message.reply('You must reply to the message.');
    }

    if (!message.mentions.users.filter((b) => !b.bot).size) {
      return message.reply('You must @ the user.');
    }

    const dankMessage = await message.channel.messages.fetch(
      message.reference.messageId
    );
    if (!dankMessage.embeds.length) {
      return message.reply("Not the right message? Couldn't find any embeds.");
    }
    const dbItems = await itemsDb.find({});
    const itemms = [];
    for (const iitem of dbItems) {
      itemms.push(iitem.display.name.split(' ').join('').toLowerCase());
    }
    const itemArray = getItems(
      dankMessage.embeds[0].fields[0].value.split('\n')
    );
    let toAdd = 0;
    const erray = [];
    let doneTems = [];
    for (const item of itemArray.split('\n')) {
      if (!item.length) continue;
      console.log(item);
      if (item.includes('x')) {
        const temp = item.split('x', 1);
        const amount = temp[0];
        let ktem = item.replace(`${amount}x`, '');
        let got = false;
        for (const i of itemms) {
          if (got) continue;
          const res = i.localeCompare(ktem);
          if (res === 0) {
            got = true;
            const value =
              amount *
              (dbItems.find(
                (a) => a.display.name.split(' ').join('').toLowerCase() === ktem
              )
                ? dbItems.find(
                    (a) =>
                      a.display.name.split(' ').join('').toLowerCase() === ktem
                  ).value
                : 0);
            if (
              !doneTems.includes(
                `${amount}x ${ktem}: ⏣ ${value.toLocaleString()}`
              )
            )
              doneTems.push(`${amount}x ${ktem}: ⏣ ${value.toLocaleString()}`);
            console.log(`will add ${value}`);
            toAdd += value;
          } else {
          }
        }
      } else {
        if (!doneTems.includes(`⏣ ${parseInt(item)}`)) {
          doneTems.push(`⏣ ${parseInt(item)}`);
        }
        toAdd += parseInt(item);
        console.log(`will add ${item}`);
      }
    }

    const embed = new EmbedBuilder()
      .setTitle('Donation Added')
      .setDescription(`Logged items:\n> ${doneTems.join('\n> ')}`)
      .setColor('Green');
    let dbUser;
    try {
      dbUser = await db.findOne({
        userID: message.mentions.users.filter((u) => !u.bot).first().id,
        guildID: message.guild.id
      });
      if (!dbUser) {
        dbUser = new db({
          userID: message.mentions.users.filter((u) => !u.bot).first().id,
          guildID: message.guild.id,
          messages: 0
        });
      }

      dbUser.messages += toAdd;
      dbUser.save();
    } catch (e) {
      return message.reply(
        `An error occured while saving amount to database.\nError: ${e.message}`
      );
    }
    embed.addFields('Amount added:', `⏣ ${toAdd.toLocaleString()}`, true);
    embed.addFields(
      `Total amount donated by ${
        message.mentions.users.filter((u) => !u.bot).first().tag
      }:`,
      `⏣ ${dbUser.messages.toLocaleString()}`,
      true
    );
    if (erray.length) {
      embed.addFields('ERRORS:', erray.join('\n'));
    }
    return message.reply({
      embeds: [embed]
    });
  }
};

function getItems(arr) {
  let a = '';
  arr.forEach((value) => {
    if (value.includes('⏣ ')) {
      a += '\n' + value.split('⏣ ')[1].replace(/(\*|,)/g, '');
    } else {
      let aa = value
        .split('**')
        .join('')
        .split(' ')
        .join('')
        .replace(/(>|:)/g, ' ')
        .split(' ');
      const number = value
        .split('**')
        .join('')
        .split(' ')
        .join('')
        .replace(/(>|:)/g, ' ')
        .split(' ')
        .filter((a) => a.includes('x'))[0]
        .replace(/(<a|,|<)/g, '');
      console.log(`a: ${aa}\nnumber: ${number}`);
      a += '\n' + number + aa[aa.length - 1].toLowerCase();
    }
  });
  console.log(a);
  return a;
}
