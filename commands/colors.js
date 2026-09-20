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

const SELECT_MENU_ID = 'color_role_selector';

const COLOR_ROLES = [
  { label: 'Blue Moon', roleId: '1550904091025080461', emoji: { id: '1550910508029321288', name: 'bluemoon' } },
  { label: 'Coral Moon', roleId: '1550905160555823124', emoji: { id: '1550910786577367060', name: 'coralmoon' } },
  { label: 'Green Moon', roleId: '1550905642150002719', emoji: { id: '1550911208054325258', name: 'greenmoon' } },
  { label: 'Orange Moon', roleId: '1550905964348317887', emoji: { id: '1550910848250290197', name: 'orangemoon' } },
  { label: 'Pastelyellow Moon', roleId: '1550906105805279283', emoji: { id: '1550910884728143973', name: 'pastelyellowmoon' } },
  { label: 'Purple Moon', roleId: '1550906327407132734', emoji: { id: '1550910624337240094', name: 'purplemoon' } },
  { label: 'Deepblue Moon', roleId: '1550906499054702745', emoji: { id: '1550910555274084422', name: 'deepbluemoon' } },
  { label: 'Pastelgreen Moon', roleId: '1550906734976045097', emoji: { id: '1550910658877464637', name: 'pastelgreenmoon' } },
  { label: 'Peach Moon', roleId: '1550906853586903220', emoji: { id: '1550910725025964142', name: 'peachmoon' } },
  { label: 'Red Moon', roleId: '1550907090837446728', emoji: { id: '1550910816650395709', name: 'redmoon' } },
  { label: 'Silver Moon', roleId: '1550913933949407332', emoji: { id: '1550910985404158103', name: 'silvermoon' } },
  { label: 'White Moon', roleId: '1550914099540656288', emoji: { id: '1550910756621516840', name: 'whitemoon' } },
  { label: 'Yellow Moon', roleId: '1550914372212105278', emoji: { id: '1550910930630611005', name: 'yellowmoon' } },
  { label: 'Mustard Moon', roleId: '1550914536154857552', emoji: { id: '1550911282692096050', name: 'mustardmoon' } },
  { label: 'Terracotta Moon', roleId: '1550914631009046688', emoji: { id: '1550910590363369593', name: 'terracottamoon' } },
  { label: 'Olive Moon', roleId: '1550914806679076984', emoji: { id: '1550911054005928147', name: 'olivemoon' } },
  { label: 'Softblush Moon', roleId: '1550914955694309538', emoji: { id: '1550911179382333560', name: 'softblushmoon' } },
  { label: 'Warmpink Moon', roleId: '1550915178621833316', emoji: { id: '1550910692004200559', name: 'warmpinkmoon' } },
  { label: 'Rust Moon', roleId: '1550915266899222628', emoji: { id: '1550911129834881145', name: 'rustmoon' } },
  { label: 'Mocha Moon', roleId: '1550915432074969212', emoji: { id: '1550911251423436840', name: 'mochamoon' } },
];

// Old color roles ("... Enjoyer"). If members still have them, they are removed when the
// member picks a new color, so nobody ends up with two colors. Once you have deleted the
// old roles from the server you can delete this list.
const LEGACY_COLOR_ROLE_IDS = [
  '1545362090280353822', // Pink Enjoyer
  '1545362235533303869', // Green Enjoyer
  '1545362416295092234', // Blue Enjoyer
  '1545362477141852210', // Orange Enjoyer
  '1545362547161567232', // Purple Enjoyer
  '1545362602144571483', // Red Enjoyer
  '1545362774572662815', // Yellow Enjoyer
];

function emojiText(emoji) {
  return `<:${emoji.name}:${emoji.id}>`;
}

function buildContainer() {
  const container = new ContainerBuilder().setAccentColor(0x55d2e2);
  const file = new AttachmentBuilder(
    path.join(__dirname, '..', 'assets', 'Colors.png'),
    { name: 'Colors.png' }
  );

  container.addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL('attachment://Colors.png')
    )
  );
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      '## 🎨 Color Catalog\n' +
      'Pilih satu warna untuk ditampilkan pada username kamu. Memilih warna baru akan mengganti warna sebelumnya.\n\n' +
      COLOR_ROLES.map((color) => `${emojiText(color.emoji)} <@&${color.roleId}>`).join('\n')
    )
  );

  const menu = new StringSelectMenuBuilder()
    .setCustomId(SELECT_MENU_ID)
    .setPlaceholder('Klik untuk memilih warna')
    .setMinValues(1)
    .setMaxValues(1)
    .addOptions(
      COLOR_ROLES.map((color) => ({
        label: color.label,
        value: color.roleId,
        emoji: color.emoji,
      }))
    );

  container.addActionRowComponents(new ActionRowBuilder().addComponents(menu));
  return { container, file };
}

async function handleSelection(interaction) {
  if (!interaction.inGuild()) {
    await interaction.reply({ content: '⚠️ Menu ini hanya dapat digunakan di server.', ephemeral: true });
    return;
  }

  try {
    const member = await interaction.guild.members.fetch(interaction.user.id);
    const selectedRoleId = interaction.values[0];
    const oldColorRoleIds = [...COLOR_ROLES.map((color) => color.roleId), ...LEGACY_COLOR_ROLE_IDS]
      .filter((id) => id !== selectedRoleId && member.roles.cache.has(id));
    const rolesToChange = [...oldColorRoleIds, selectedRoleId]
      .map((id) => interaction.guild.roles.cache.get(id));

    if (rolesToChange.some((role) => !role || !role.editable)) {
      await interaction.reply({
        content: '⚠️ Bot tidak bisa mengubah role warna. Pastikan bot memiliki **Manage Roles** dan role bot berada di atas semua role warna.',
        ephemeral: true,
      });
      return;
    }

    if (oldColorRoleIds.length) {
      await member.roles.remove(oldColorRoleIds, 'Color role self-selection');
    }
    if (!member.roles.cache.has(selectedRoleId)) {
      await member.roles.add(selectedRoleId, 'Color role self-selection');
    }

    const selectedColor = COLOR_ROLES.find((color) => color.roleId === selectedRoleId);
    await interaction.reply({
      content: `✅ Warna username kamu sekarang: ${emojiText(selectedColor.emoji)} **${selectedColor.label}**`,
      ephemeral: true,
    });
  } catch (err) {
    console.error('Gagal mengubah color role:', err);
    if (!interaction.replied) {
      await interaction.reply({ content: '⚠️ Terjadi error saat mengubah warna. Cek log bot.', ephemeral: true }).catch(() => {});
    }
  }
}

module.exports = {
  name: 'colors',
  SELECT_MENU_ID,
  buildContainer,
  handleSelection,
  async execute(message) {
    const { container, file } = buildContainer();
    await message.delete().catch(() => {});
    await message.channel.send({
      components: [container],
      files: [file],
      flags: MessageFlags.IsComponentsV2,
      allowedMentions: { parse: [] }, // role mentions are displayed but nobody gets pinged
    });
  },

  // Usage: !updatecolors <message id>  (or reply to the color catalog message with !updatecolors)
  async update(message, args = []) {
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator)) return;

    await message.delete().catch(() => {});

    // Short feedback message that removes itself, so the channel stays clean
    const notify = async (text) => {
      const reply = await message.channel.send(text).catch(() => null);
      if (reply) setTimeout(() => reply.delete().catch(() => {}), 5000);
    };

    try {
      const messageId = args[0] || message.reference?.messageId;
      if (!messageId || !/^\d{17,20}$/.test(messageId)) {
        return await notify('❌ Usage: `!updatecolors <message id>` (or reply to the color catalog message with `!updatecolors`).');
      }

      const target = await message.channel.messages.fetch(messageId).catch(() => null);
      if (!target || target.author.id !== message.client.user.id) {
        return await notify('❌ Message not found in this channel, or it was not sent by the bot.');
      }

      const { container, file } = buildContainer();
      await target.edit({
        components: [container],
        files: [file],
        flags: MessageFlags.IsComponentsV2,
        allowedMentions: { parse: [] },
      });

      await notify('✅ Color catalog updated.');
    } catch (err) {
      console.error('Gagal update color catalog message:', err);
      await notify(`❌ Error: ${err.message}`);
    }
  },
};
