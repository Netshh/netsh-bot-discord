const path = require('path');
const {
  ActionRowBuilder,
  AttachmentBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  PermissionFlagsBits,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
} = require('discord.js');

const SELECT_MENU_ID = 'game_role_selector';

const GAME_ROLES = [
  { label: 'Counter-Strike', roleId: '1545361004911927326', emoji: { id: '1545373686465298473', name: 'cs2' } },
  { label: 'Mobile Legends', roleId: '1545361185413668935', emoji: { id: '1545373720388833311', name: 'mlbb' } },
  { label: 'Roblox', roleId: '1545362906714079273', emoji: { id: '1545373757684842576', name: 'roblox' } },
  { label: 'GTA', roleId: '1545362971444777032', emoji: { id: '1545373806296703036', name: 'gta' } },
  { label: 'FIFA', roleId: '1545363031674847272', emoji: { id: '1545373844502610081', name: 'fc27' } },
  { label: 'Rising Force', roleId: '1545361235589996544', emoji: { id: '1545373880875491428', name: 'rfonline' } },
  { label: 'Dota 2', roleId: '1550827149819248670', emoji: { id: '1550854759295098900', name: 'dota2' } },
  { label: 'Valorant', roleId: '1550827507480010863', emoji: { id: '1550855096563404901', name: 'valorant' } },
  { label: 'PUBG', roleId: '1550829110396325999', emoji: { id: '1550857718590341160', name: 'pubg' } },
  { label: 'PUBG Mobile', roleId: '1550858887127638058', emoji: { id: '1550858850243059812', name: 'pubgm' } },
  { label: 'Genshin Impact', roleId: '1550855916264624138', emoji: { id: '1550859980650053652', name: 'genshin' } },
  { label: 'Wuthering Waves', roleId: '1550856062830252063', emoji: { id: '1550860014930104391', name: 'wuwa' } },
  { label: 'Zenless Zone Zero', roleId: '1550856991625318411', emoji: { id: '1550860056327757975', name: 'zzz' } },
  { label: 'Call of Duty', roleId: '1550860489058426901', emoji: { id: '1550860461673684992', name: 'cod' } },
  { label: 'COD Mobile', roleId: '1550859527908360222', emoji: { id: '1550859657315229716', name: 'codm' } },
];

function emojiText(emoji) {
  return `<:${emoji.name}:${emoji.id}>`;
}

function buildContainer() {
  const container = new ContainerBuilder().setAccentColor(0x57f287);

  container.addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL('attachment://Roles.png')
    )
  );

  const roleList = GAME_ROLES
    .map((game) => `${emojiText(game.emoji)} <@&${game.roleId}>`)
    .join('\n');

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      '## 🎮 Pilih Role Game Kamu\n' +
      'Pilih semua game yang kamu mainkan, lalu tekan **Submit**. Kamu dapat memilih lebih dari satu role.\n\n' +
      roleList +
      '\n\n> Untuk menghapus role game, buka menu lagi dan kirim pilihan terbaru kamu.'
    )
  );

  const menu = new StringSelectMenuBuilder()
    .setCustomId(SELECT_MENU_ID)
    .setPlaceholder('Klik untuk memilih role game')
    .setMinValues(0)
    .setMaxValues(GAME_ROLES.length)
    .addOptions(
      GAME_ROLES.map((game) => ({
        label: game.label,
        value: game.roleId,
        emoji: game.emoji,
      }))
    );

  container.addActionRowComponents(new ActionRowBuilder().addComponents(menu));
  return container;
}

async function handleSelection(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({ content: '⚠️ Menu ini hanya dapat digunakan di server.', ephemeral: true });
    return;
  }

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const selectedRoleIds = new Set(interaction.values);
    const menuRoleIds = GAME_ROLES.map((game) => game.roleId);
    const rolesToAdd = menuRoleIds.filter((id) => selectedRoleIds.has(id) && !member.roles.cache.has(id));
    const rolesToRemove = menuRoleIds.filter((id) => !selectedRoleIds.has(id) && member.roles.cache.has(id));
    const affectedRoles = [...rolesToAdd, ...rolesToRemove]
      .map((id) => interaction.guild.roles.cache.get(id));

    const unavailableRole = affectedRoles.find((role) => !role || !role.editable);
    if (unavailableRole) {
      await interaction.reply({
        content: '⚠️ Bot tidak bisa mengubah salah satu role ini. Pastikan bot memiliki **Manage Roles** dan role bot berada di atas role game.',
        ephemeral: true,
      });
      return;
    }

    if (rolesToAdd.length) await member.roles.add(rolesToAdd, 'Game role self-selection');
    if (rolesToRemove.length) await member.roles.remove(rolesToRemove, 'Game role self-selection');

    const selectedNames = GAME_ROLES
      .filter((game) => selectedRoleIds.has(game.roleId))
      .map((game) => `${emojiText(game.emoji)} ${game.label}`);

    await interaction.reply({
      content: selectedNames.length
        ? `✅ Role game kamu diperbarui: ${selectedNames.join(', ')}`
        : '✅ Semua role game dari menu ini telah dihapus.',
      ephemeral: true,
    });
  } catch (err) {
    console.error('Gagal mengubah game role:', err);
    if (!interaction.replied) {
      await interaction.reply({ content: '⚠️ Terjadi error saat mengubah role. Cek log bot.', ephemeral: true }).catch(() => {});
    }
  }
}

module.exports = {
  name: 'roles',
  SELECT_MENU_ID,
  buildContainer,
  handleSelection,
  async execute(message) {
    const file = new AttachmentBuilder(path.join(__dirname, '..', 'assets', 'Roles.png'), { name: 'Roles.png' });
    await message.delete().catch(() => {});
    await message.channel.send({
      components: [buildContainer()],
      files: [file],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] }, // role mentions are displayed but nobody gets pinged
    });
  },

  // Usage: !updateroles <message id>  (or reply to the roles message with !updateroles)
  async update(message, args = []) {
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) return;

    await message.delete().catch(() => {});

    // Short feedback message that removes itself, so the roles channel stays clean
    const notify = async (text) => {
      const reply = await message.channel.send(text).catch(() => null);
      if (reply) setTimeout(() => reply.delete().catch(() => {}), 5000);
    };

    try {
      const messageId = args[0] || message.reference?.messageId;
      if (!messageId || !/^\d{17,20}$/.test(messageId)) {
        return await notify('❌ Usage: `!updateroles <message id>` (or reply to the roles message with `!updateroles`).');
      }

      const target = await message.channel.messages.fetch(messageId).catch(() => null);
      if (!target || target.author.id !== message.client.user.id) {
        return await notify('❌ Message not found in this channel, or it was not sent by the bot.');
      }

      const file = new AttachmentBuilder(path.join(__dirname, '..', 'assets', 'Roles.png'), { name: 'Roles.png' });
      await target.edit({
        components: [buildContainer()],
        files: [file],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { parse: [] },
      });

      await notify('✅ Roles message updated.');
    } catch (err) {
      console.error('Gagal update roles message:', err);
      await notify(`❌ Error: ${err.message}`);
    }
  },
};
