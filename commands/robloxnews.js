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
  name: 'robloxnews',
  async execute(message) {
    const container = new ContainerBuilder().setAccentColor(0xe85a5a);
    const file = new AttachmentBuilder(
      path.join(__dirname, '..', 'assets', 'roblox-news.png'),
      { name: 'roblox-news.png' }
    );

    container.addMediaGalleryComponents(
      new MediaGalleryBuilder().addItems(
        new MediaGalleryItemBuilder().setURL('attachment://roblox-news.png')
      )
    );

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '## <:roblox:1545373757684842576> Roblox News\n' +
        'Selamat datang di channel pembaruan resmi **Roblox**.'
      )
    );
    container.addSeparatorComponents(
      new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
    );
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        '**Apa yang akan kamu dapatkan di sini?**\n' +
        '• Update penting Roblox dari channel resmi\n' +
        '• Pengumuman event, fitur baru, dan informasi terbaru\n' +
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
