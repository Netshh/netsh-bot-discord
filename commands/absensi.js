// commands/absensi.js
const { EmbedBuilder, escapeMarkdown } = require('discord.js');

const { ROLE_ID } = require('../config/ids.js');

const SEPARATOR = ' - ';
const MAX_NICKNAME_LENGTH = 32; // Discord's nickname limit

module.exports = {
  name: 'absen',
  async execute(message) {
    const content = message.content.trim();

    // Split on the FIRST " - " only, so the in-game name may itself contain
    // hyphens or any other special characters.
    const sepIndex = content.indexOf(SEPARATOR);
    const nama = sepIndex === -1 ? '' : content.slice(0, sepIndex).trim();
    const namaIngame = sepIndex === -1 ? '' : content.slice(sepIndex + SEPARATOR.length).trim();

    if (!nama || !namaIngame) {
      const warn = await message.reply(
        '❌ Format salah. Gunakan: `Nama - Nama Ingame`\nContoh: `Jamal - Jamalgaming67`'
      );
      setTimeout(() => warn.delete().catch(() => {}), 8000);
      return;
    }

    const nickname = `${nama}${SEPARATOR}${namaIngame}`;

    if (nickname.length > MAX_NICKNAME_LENGTH) {
      const warn = await message.reply(
        `❌ Nickname terlalu panjang (${nickname.length}/${MAX_NICKNAME_LENGTH} karakter). Persingkat nama kamu lalu kirim ulang.`
      );
      setTimeout(() => warn.delete().catch(() => {}), 8000);
      return;
    }

    try {
      const role = message.guild.roles.cache.get(ROLE_ID);
      await message.member.roles.add(role);

      await message.member.setNickname(nickname).catch(() => {
        console.log(`Gagal ubah nickname ${message.author.tag} (mungkin bot bukan admin/role lebih rendah, atau member adalah owner server)`);
      });

      const embed = new EmbedBuilder()
        .setColor(0x57f287)
        .setDescription(
          `✅ Absensi diterima. Selamat datang, **${escapeMarkdown(nama)}** (${escapeMarkdown(namaIngame)})!\nRole diberikan: <@&${ROLE_ID}>`
        );

      await message.reply({ embeds: [embed], allowedMentions: { repliedUser: true, parse: [] } });
      await message.react('✅');
    } catch (err) {
      console.error('Gagal assign role:', err);
      message.reply('⚠️ Ada error saat assign role, cek log server.');
    }
  },
};