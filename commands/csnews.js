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
  name: 'csnews',
  async execute(message) {
    const container = new ContainerBuilder().setAccentColor(0xf4a641);
    const file = new AttachmentBuilder(
      path.join(__dirname, '..', 'assets', 'cs-news.png'),
      { name: 'cs-news.png' }
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL('attachment://cs-news.png')
      )
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## <:cs2:1545373686465298473> Counter-Strike 2 News\n' +
        'Selamat datang di channel pembaruan resmi **Counter-Strike 2**.'
      )
    );
    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '**Apa yang akan kamu dapatkan di sini?**\n' +
        '• Update penting CS2 dari channel resmi Counter-Strike Discord\n' +
        '• Patch notes, pengumuman event, dan informasi terbaru\n' +
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
