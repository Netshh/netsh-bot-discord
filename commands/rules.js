// commands/rules.js
const {
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SeparatorSpacingSize,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  AttachmentBuilder,
  MessageFlags,
} = require('discord.js');

const rulesID = [
  { title: '1. Hormati Sesama Anggota', text: 'Bersikaplah sopan dan hormati semua anggota. Hinaan, diskriminasi, pelecehan, ujaran kebencian, atau segala bentuk toksisitas tidak akan ditoleransi.' },
  { title: '2. Konten yang Pantas', text: 'Membagikan konten NSFW, gore, ilegal, atau konten sensitif lainnya sangat dilarang. Gunakan akal sehat.' },
  { title: '3. Dilarang Spam atau Flooding', text: 'Hindari mengirim pesan berulang, tautan berlebihan tanpa diminta, atau tindakan apapun yang mengganggu percakapan anggota lain.' },
  { title: '4. Gunakan Channel dengan Benar', text: 'Posting sesuai dengan channel yang tersedia. Perhatikan deskripsi tiap channel agar tidak salah tempat (misal: command bot digunakan di #cmds).' },
  { title: '5. Diskusi yang Sehat', text: 'Debat dipersilakan, tapi harus dilakukan secara sopan. Hindari serangan pribadi dan topik kontroversial yang berlebihan.' },
  { title: '6. Dilarang Meminta-minta', text: 'Sangat dilarang meminta poin Steam, game, atau akun Steam. Hargai komunitas dan hindari permintaan semacam ini.' },
  { title: '7. Dilarang Berpura-pura Jadi Orang Lain', text: 'Menyamar sebagai staff, anggota, atau tokoh publik sangat dilarang. Termasuk menggunakan username atau avatar yang mirip untuk menipu.' },
  { title: '8. Dilarang Promosi Tanpa Izin', text: 'Tidak boleh membagikan tautan server Discord lain, media sosial, atau bentuk promosi apapun tanpa izin dari staff.' },
  { title: '9. Patuhi Ketentuan Discord', text: 'Semua anggota wajib mengikuti Discord Terms of Service dan Community Guidelines resmi Discord, selain aturan server ini.' },
  { title: '10. Ikuti Keputusan Staff', text: 'Keputusan staff/moderator bersifat final. Jika ada keberatan, sampaikan secara pribadi lewat DM ke staff, bukan di channel publik.' },
];

const rulesEN = [
  { title: '1. Respect Above All', text: 'Be courteous and respectful to all members. Insults, discrimination, harassment, hate speech, or any form of toxicity will not be tolerated.' },
  { title: '2. Keep Content Appropriate', text: 'Sharing NSFW, gore, illegal, or overly sensitive content is strictly prohibited. Please use common sense.' },
  { title: '3. No Spam or Flooding', text: 'Avoid sending repetitive messages, excessive unsolicited links, or any practice that disrupts the conversation for other members.' },
  { title: '4. Use Channels Correctly', text: "Post your content in the appropriate channel. Pay attention to each channel's description (e.g., bot commands should be used in #cmds)." },
  { title: '5. Healthy Discussions', text: 'Debates are welcome, but must be conducted respectfully. Avoid personal attacks and overly controversial topics.' },
  { title: '6. No Begging', text: 'It is strictly forbidden to beg for Steam points, games, or Steam accounts. Please respect the community.' },
  { title: '7. Impersonation Forbidden', text: 'Pretending to be staff, members, or public figures is strictly prohibited, including similar usernames or avatars to mislead others.' },
  { title: '8. No Unauthorized Promotion', text: 'Do not share links to other Discord servers, social media, or any form of promotion without staff approval.' },
  { title: '9. Follow Discord ToS', text: "All members must follow Discord's official Terms of Service and Community Guidelines, in addition to these server rules." },
  { title: '10. Respect Staff Decisions', text: 'Staff/moderator decisions are final. If you have objections, raise them privately via DM to staff, not in public channels.' },
];

function buildContainer(lang) {
  const data = lang === 'en' ? rulesEN : rulesID;

  const container = new ContainerBuilder().setAccentColor(0x57f287);

  container.addMediaGalleryComponents(
    new MediaGalleryBuilder().addItems(
      new MediaGalleryItemBuilder().setURL('attachment://Rules.png')
    )
  );

  data.forEach((rule, index) => {
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`**${rule.title}**\n${rule.text}`)
    );

    if (index < data.length - 1) {
      container.addSeparatorComponents(
        new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
      );
    }
  });

  const button = new ButtonBuilder()
    .setCustomId(lang === 'en' ? 'rules_id' : 'rules_en')
    .setLabel(lang === 'en' ? 'Bahasa Indonesia' : 'English')
    .setEmoji(lang === 'en' ? '🇮🇩' : '🇬🇧')
    .setStyle(ButtonStyle.Secondary);

  container.addSeparatorComponents(
    new SeparatorBuilder().setDivider(true).setSpacing(SeparatorSpacingSize.Small)
  );
  container.addActionRowComponents(new ActionRowBuilder().addComponents(button));

  return container;
}

module.exports = {
  name: 'rules',
  buildContainer,
  async execute(message) {
    const file = new AttachmentBuilder('./assets/Rules.png', { name: 'Rules.png' });
    const container = buildContainer('id');

    await message.delete().catch(() => {});
    await message.channel.send({
      components: [container],
      files: [file],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};