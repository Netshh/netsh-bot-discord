const path = require('path');
const { AttachmentBuilder, MessageFlags, PermissionFlagsBits } = require('discord.js');
const { buildContainer } = require('./roles');

module.exports = {
  name: 'updateroles',
  async execute(message) {
    console.log('[updateroles] triggered by', message.author.tag);
    try {
      if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
        return await message.reply('❌ You need the Administrator permission to use this.');
      }

      const messageId = message.content.trim().split(/\s+/)[1];
      if (!messageId) return await message.reply('Usage: `!updateroles <message id>`');

      const target = await message.channel.messages.fetch(messageId).catch((e) => {
        console.error('[updateroles] fetch failed:', e.message);
        return null;
      });
      if (!target) {
        return await message.reply('❌ Message not found. Run this command in the SAME channel as the roles message.');
      }
      if (target.author.id !== message.client.user.id) {
        return await message.reply('❌ That message was not sent by this bot.');
      }

      const file = new AttachmentBuilder(path.join(__dirname, '..', 'assets', 'Roles.png'), { name: 'Roles.png' });
      await target.edit({
        components: [buildContainer()],
        files: [file],
        flags: MessageFlags.IsComponentsV2,
      });

      console.log('[updateroles] edit OK');
      await message.reply('✅ Roles message updated.');
    } catch (err) {
      console.error('[updateroles] error:', err);
      await message.reply(`❌ Error: ${err.message}`).catch(() => {});
    }
  },
};