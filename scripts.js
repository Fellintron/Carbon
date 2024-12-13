const { randomBytes } = require('crypto');
const { ButtonBuilder } = require('discord.js');

global.disableComponents = (components) => {
  for (let x = 0; x < components.length; x++) {
    for (let y = 0; y < components[x].components.length; y++) {
      components[x].components[y] = ButtonBuilder.from(
        components[x].components[y]
      );
      components[x].components[y].setDisabled(true);
    }
  }

  return components;
};

const { Client } = require('discord.js');

/**
 * @param {Client} client
 * @param {String} id
 */
const DMUser = async (client, id, { embeds, content }) => {
  try {
    const user = await client.users.fetch(id);
    if (user) {
      (await user.createDM()).send({
        content: content ? content.toString() : '',
        embeds: embeds ? [embeds] : []
      });
    }
  } catch (e) {
    return null;
  }
};
/**
 *
 * @param {Number} min
 * @param {Number} max
 *
 * @returns Random number between `min` and `max`
 */
const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

global.sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

global.timestamp = (time, format) => {
  return `<t:${(time / 1000).toFixed(0)}:${format || 'R'}>`;
};

module.exports.dmUser = DMUser;
module.exports.getRandom = getRandom;
module.exports.sleep = sleep;
module.exports.timestamp = timestamp;