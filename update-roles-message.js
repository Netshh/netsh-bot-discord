require('dotenv').config();
const path = require('path');
const { Client, GatewayIntentBits, AttachmentBuilder, MessageFlags } = require('discord.js');
const { buildContainer } = require('./commands/roles');

const MESSAGE_ID = '1548210931568214059';
const TOKEN = process.env.DISCORD_TOKEN || process.env.TOKEN || process.env.BOT_TOKEN;

if (!TOKEN) {
  console.error('❌ No token found in .env, check the variable name');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('clientReady', async () => {
  try {
    const guild = client.guilds.cache.first();
    const channels = await guild.channels.fetch();

    let target = null;
    for (const ch of channels.values()) {
      if (!ch || !ch.isTextBased()) continue;
      target = await ch.messages.fetch(MESSAGE_ID).catch(() => null);
      if (target) break;
    }
    if (!target) throw new Error('Message not found in any channel');
    if (target.author.id !== client.user.id) throw new Error('That message was not sent by this bot');

    const file = new AttachmentBuilder(path.join(__dirname, 'assets', 'Roles.png'), { name: 'Roles.png' });
    await target.edit({
      components: [buildContainer()],
      files: [file],
      flags: MessageFlags.IsComponentsV2,
    });
    console.log('✅ Edited message in #' + target.channel.name);
  } catch (err) {
    console.error('❌', err);
  }
  await client.destroy();
  process.exit(0);
});

client.login(TOKEN);