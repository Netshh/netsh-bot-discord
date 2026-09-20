// commands/absensi.js
const { EmbedBuilder } = require('discord.js');

const { ROLE_ID } = require('../config/ids.js');
const FORMAT_REGEX = /^[a-zA-Z0-9\s]+ - [a-zA-Z0-9\s]+$/;

module.exports = {
  name: 'absen',
  async execute(message) {
    const content = message.content.trim();

    if (!FORMAT_REGEX.test(content)) {
      const warn = await message.reply(
        '❌ Format salah. Gunakan: `Nama - Nama Ingame`\nContoh: `Jamal - Jamalgaming67`'
      );
      setTimeout(() => warn.delete().catch(() => {}), 8000);
      return;
    }

    const [nama, namaIngame] = content.split(' - ').map((s) => s.trim());

    try {
      const role = message.guild.roles.cache.get(ROLE_ID);
      await message.member.roles.add(role);

      await message.member.setNickname(content).catch(() => {
        console.log(`Gagal ubah nickname ${message.author.tag} (mungkin bot bukan admin/role lebih rendah, atau nickname > 32 karakter)`);
      });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setDescription(
          `✅ Absensi diterima. Selamat datang, **${nama}** (${namaIngame})!\nRole diberikan: <@&${ROLE_ID}>`
        );

      await message.reply({ embeds: [embed] });
      await message.react('✅');
    } catch (err) {
      console.error('Gagal assign role:', err);
      message.reply('⚠️ Ada error saat assign role, cek log server.');
    }
  },
};