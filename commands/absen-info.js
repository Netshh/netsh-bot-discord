const path = require('path');
const {
  AttachmentBuilder,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SeparatorBuilder,
  SeparatorSpacingSize,
  TextDisplayBuilder,
} = require('discord.js');
const { ROLE_ID } = require('../config/ids.js');

module.exports = {
  name: 'abseninfo',
  async execute(message) {
    const container = new ContainerBuilder().setAccentColor(0x57f287);
    const file = new AttachmentBuilder(
      path.join(__dirname, '..', 'assets', 'Absensi.png'),
      { name: 'Absensi.png' }
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL('attachment://Absensi.png')
      )
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## 📋 Cara Absensi\n' +
        'Untuk verifikasi keanggotaan, kirim pesan di channel ini dengan format berikut.'
      )
    );
    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `**Format**\n\`Nama - Nama Ingame\`\n\n` +
        `**Contoh**\n\`Jamal - Jamalgaming67\`\n\n` +
        `**Setelah absen, kamu akan mendapatkan**\n• Role <@&${ROLE_ID}>\n• Nickname otomatis sesuai format di atas`
      )
    );

    await message.delete().catch(() => {});
    await message.channel.send({
      components: [container],
      files: [file],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};
