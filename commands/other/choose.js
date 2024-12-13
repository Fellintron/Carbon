const { inlineCode } = require('discord.js');

module.exports = {
  name: 'choose',
  aliase: ['pick','choice'],
  category: 'Other',
  usage: '<options>',
  description: "Get a random value from a set of choices.",
  async execute(message, args) {
    const possibles = args.split(/[,|-]+/)
			.map((s) => s.trim())
			.filter((s) => s.length > 0);
		
		if (possibles.length === 1 || possibles.length === 0) {
			return message.channel.send({ content: "There needs to be at least two values."
		})
		}

		if (possibles.length !== new Set(possibles).size) {
			return message.channel.send({ content: "There is at least one duplicate value in your set, please remove them.",
		})
		}

		const position = Math.floor(Math.random() * possibles.length);
		
		return message.channel.send({ content : `👯 *Porcupine in pointy shoes, which one will my pointer choose?*... I choose: ${inlineCode(possibles[position])}` });
  }
};

function escapeInlineCode(text) {
	return text.replaceAll('`', '῾');
}