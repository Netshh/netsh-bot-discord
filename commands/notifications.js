const path = require('path');
const {
  ActionRowBuilder,
  AttachmentBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  TextDisplayBuilder,
} = require('discord.js');

const SELECT_MENU_ID = 'notification_role_selector';

const NOTIFICATION_ROLES = [
  {
    label: 'Free Games',
    roleId: '1550831696822276209',
    emoji: { id: '1550884003588997131', name: 'free_games' },
    description: 'Dapatkan notifikasi saat ada game gratis yang diposting di <#1550824308421435463>.',
    menuDescription: 'Notifikasi saat ada game gratis yang diposting.',
  },
  {
    label: 'Social Media',
    roleId: '1550886379037401120',
    emoji: { id: '1550886292630278296', name: 'social_media' },
    description: 'Dapatkan notifikasi saat owner atau staff mengunggah video maupun melakukan livestream.',
    menuDescription: 'Notifikasi video atau livestream dari owner/staff.',
  },
  {
    label: 'Giveaway',
    roleId: '1550881323034607656',
    emoji: { id: '1550890489614438531', name: 'giveaway' },
    description: 'Dapatkan notifikasi giveaway Discord Nitro, Dana Kaget, Steam Game Gift, mata uang bot, dan lainnya.',
    menuDescription: 'Notifikasi giveaway dan hadiah lainnya.',
  },
  {
    label: 'Server News',
    roleId: '1550890720561209455',
    emoji: { id: '1550885445569871912', name: 'server_news' },
    description: 'Dapatkan notifikasi saat ada perubahan atau pengumuman penting di server.',
    menuDescription: 'Notifikasi perubahan dan pengumuman server.',
  },
];

function emojiText(emoji) {
  return `<:${emoji.name}:${emoji.id}>`;
}

function buildContainer() {
  const container = new ContainerBuilder().setAccentColor(0x57f287);

  container.addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL('attachment://Notifications.png')
    )
  );

  const roleList = NOTIFICATION_ROLES
    .map((notification) =>
      `${emojiText(notification.emoji)} <@&${notification.roleId}>\n> ${notification.description}`
    )
    .join('\n\n');

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      '## 🔔 Pilih Notifikasi Kamu\n' +
      'Pilih notifikasi yang ingin kamu terima, lalu tekan **Submit**. Kamu dapat memilih lebih dari satu role.\n\n' +
      roleList +
      '\n\n> Untuk berhenti menerima notifikasi, buka menu lagi dan kirim pilihan terbaru kamu.'
    )
  );

  const menu = new StringSelectMenuBuilder()
    .setCustomId(SELECT_MENU_ID)
    .setPlaceholder('Klik untuk memilih notifikasi')
    .setMinValues(0)
    .setMaxValues(NOTIFICATION_ROLES.length)
    .addOptions(
      NOTIFICATION_ROLES.map((notification) => ({
        label: notification.label,
        value: notification.roleId,
        emoji: notification.emoji,
        description: notification.menuDescription,
      }))
    );

  container.addActionRowComponents(new ActionRowBuilder().addComponents(menu));
  return container;
}

async function handleSelection(interaction) {
  // Discord requires an acknowledgement within roughly three seconds. Role
  // changes can take longer, so acknowledge the selection before processing it.
  await interaction.deferReply({ ephemeral: true });

  if (!interaction.inGuild()) {
    await interaction.editReply('⚠️ Menu ini hanya dapat digunakan di server.');
    return;
  }

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const selectedRoleIds = new Set(interaction.values);
    const menuRoleIds = NOTIFICATION_ROLES.map((notification) => notification.roleId);
    const rolesToAdd = menuRoleIds.filter((id) => selectedRoleIds.has(id) && !member.roles.cache.has(id));
    const rolesToRemove = menuRoleIds.filter((id) => !selectedRoleIds.has(id) && member.roles.cache.has(id));
    const affectedRoles = [...rolesToAdd, ...rolesToRemove]
      .map((id) => interaction.guild.roles.cache.get(id));

    const unavailableRole = affectedRoles.find((role) => !role || !role.editable);
    if (unavailableRole) {
      await interaction.editReply(
        '⚠️ Bot tidak bisa mengubah salah satu role ini. Pastikan bot memiliki **Manage Roles** dan role bot berada di atas role notifikasi.'
      );
      return;
    }

    if (rolesToAdd.length) await member.roles.add(rolesToAdd, 'Notification role self-selection');
    if (rolesToRemove.length) await member.roles.remove(rolesToRemove, 'Notification role self-selection');

    const selectedRoles = NOTIFICATION_ROLES
      .filter((notification) => selectedRoleIds.has(notification.roleId))
      .map((notification) => `${emojiText(notification.emoji)} <@&${notification.roleId}>`);

    await interaction.editReply(
      selectedRoles.length
        ? `✅ Notifikasi kamu diperbarui: ${selectedRoles.join(', ')}`
        : '✅ Semua role notifikasi dari menu ini telah dihapus.'
    );
  } catch (err) {
    console.error('Gagal mengubah notification role:', err);
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply('⚠️ Terjadi error saat mengubah role notifikasi. Cek log bot.').catch(() => {});
    } else {
      await interaction.reply({ content: '⚠️ Terjadi error saat mengubah role notifikasi. Cek log bot.', ephemeral: true }).catch(() => {});
    }
  }
}

module.exports = {
  name: 'notifications',
  SELECT_MENU_ID,
  buildContainer,
  handleSelection,
  async execute(message) {
    const file = new AttachmentBuilder(path.join(__dirname, '..', 'assets', 'Notifications.png'), { name: 'Notifications.png' });
    await message.delete().catch(() => {});
    await message.channel.send({
      components: [buildContainer()],
      files: [file],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};
