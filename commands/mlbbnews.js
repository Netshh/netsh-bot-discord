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
  name: 'mlbbnews',
  async execute(message) {
    const container = new ContainerBuilder().setAccentColor(0x4aa8f7);
    const file = new AttachmentBuilder(
      path.join(__dirname, '..', 'assets', 'mlbb-news.png'),
      { name: 'mlbb-news.png' }
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL('attachment://mlbb-news.png')
      )
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## <:mlbb:1545373720388833311> Mobile Legends: Bang Bang News\n' +
        'Selamat datang di channel pembaruan resmi **Mobile Legends: Bang Bang**.'
      )
    );
    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '**Apa yang akan kamu dapatkan di sini?**\n' +
        '• Update penting MLBB dari channel resmi Mobile Legends: Bang Bang\n' +
        '• Patch notes, hero baru, event, dan informasi terbaru\n' +
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
