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

module.exports = {
  name: 'eafcnews',
  async execute(message) {
    const container = new ContainerBuilder().setAccentColor(0x45c8a3);
    const file = new AttachmentBuilder(
      path.join(__dirname, '..', 'assets', 'eafc-news.png'),
      { name: 'eafc-news.png' }
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL('attachment://eafc-news.png')
      )
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## <:fc27:1545373844502610081> EA SPORTS FC News\n' +
        'Selamat datang di channel pembaruan resmi **EA SPORTS FC**.'
      )
    );
    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '**Apa yang akan kamu dapatkan di sini?**\n' +
        '• Update penting EA SPORTS FC dari channel resmi\n' +
        '• Patch notes, event, mode baru, dan informasi terbaru\n' +
        '• Berita pilihan akan diteruskan otomatis ke channel ini\n\n' +
        '> Aktifkan notifikasi channel jika kamu tidak ingin melewatkan update penting.'
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
