module.exports = {
  name: 'messageDelete',
  once: false,
  async execute(message, client) {  
    await message.fetch();
    if (!message.guild || message?.author?.bot || message.webhookId) return;

    const { author, attachments, channel, content, createdTimestamp } = message;

    if (!content && attachments?.size === 0) return;

    const snipedMessages = client.snipedMessages.get(channel.id) ?? [];

    snipedMessages.unshift({
      author,
      content,
      attachmentURL: attachments?.first()?.proxyURL ?? null,
      createdTimestamp,
      deletedTimestamp: Date.now()
    });

    client.snipedMessages.set(channel.id, snipedMessages);
  }
};
