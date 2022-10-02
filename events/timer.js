const { Client, Message } = require('discord.js')
const { splitMessage } = require('../node_modules/discord.js/src/util/Util')
const timers = require('../database/models/timer')
const ms = require('better-ms')
let counter = 0
module.exports = {
    name: 'tick',
    /**
     * @param {Client} client
     */
    async execute(client) {
        counter++
        if (counter > 4) {
            counter = 0
        } else return

        const all = await timers.find({
            time: {
                $gte: new Date().getTime(),
            },
            ended: false,
        })
        if (!all.length) return
        for (const timer of all) {
            const t = 300_000
            const n = new Date().getTime()
            if (timer.time - n < t) {
                timer.ended = true
                timer.save()
                const channel = client.channels.cache.get(timer.channelId)
                const message = await channel.messages.fetch(timer.messageId)
                if (!message) return
                clearTimer(message, timer.time, timer.reminders)
            } else continue
        }
    },
}
/**
 *
 * @param {Message} message
 * @param {Number} time
 */
const clearTimer = async (message, time, arr) => {
    if (time < new Date().getTime()) {
        const messages = splitMessage(
            arr.toString() || message.client.user.id.toString()
        )

        for await (const msg of messages) {
            await message.channel.send(msg).then(async (a) => {
                await message.client.functions.sleep(1000)
                a.delete()
            })
        }

        message.channel.send({
            content: `The timer for **${message.embeds[0].title}** has ended!`,
            components: [
                new MessageActionRow().addComponents([
                    new MessageButton()
                        .setLabel('Jump')
                        .setStyle('LINK')
                        .setURL(message.url),
                ]),
            ],
        })
    }
    const formatted = ms.prettyMs(
        Number((time - new Date().getTime()).toString().slice(0, -3) + '000'),
        {
            verbose: true,
        }
    )
    message.embeds[0].setDescription(`Ends in ${formatted}`)
    await message.edit({
        embeds: message.embeds,
    })

    await setTimeout((a) => {
        clearTimer(message, time, arr)
    }, 10_000)
}
