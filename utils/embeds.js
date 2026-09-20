// utils/embeds.js
const { EmbedBuilder } = require('discord.js');

const BRAND_COLOR = 0x57f287;
const FOOTER_TEXT = 'ANAK LANGIT Community';

function baseEmbed() {
  return new EmbedBuilder()
    .setColor(BRAND_COLOR)
    .setFooter({ text: FOOTER_TEXT });
}

module.exports = { baseEmbed, BRAND_COLOR, FOOTER_TEXT };