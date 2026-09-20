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
  name: 'rfnews',
  async execute(message) {
    const container = new ContainerBuilder().setAccentColor(0x9b63d2);
    const file = new AttachmentBuilder(
      path.join(__dirname, '..', 'assets', 'rfnext-news.png'),
      { name: 'rfnext-news.png' }
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL('attachment://rfnext-news.png')
      )
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## <:rfonline:1545373880875491428> RF Online Next News\n' +
        'Selamat datang di channel pembaruan resmi **RF Online Next**.'
      )
    );
    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '**Apa yang akan kamu dapatkan di sini?**\n' +
        '• Update penting RF Online Next dari channel resmi\n' +
        '• Patch notes, event, konten baru, dan informasi terbaru\n' +
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
