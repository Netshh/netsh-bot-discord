// events/interactionCreate.js
const rulesCommand = require('../commands/rules.js');
const rolesCommand = require('../commands/roles.js');
const colorsCommand = require('../commands/colors.js');
const notificationsCommand = require('../commands/notifications.js');
const { AttachmentBuilder, MessageFlags } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isStringSelectMenu() && interaction.customId === rolesCommand.SELECT_MENU_ID) {
      await rolesCommand.handleSelection(interaction);
      return;
    }

    if (interaction.isStringSelectMenu() && interaction.customId === colorsCommand.SELECT_MENU_ID) {
      await colorsCommand.handleSelection(interaction);
      return;
    }

    if (interaction.isStringSelectMenu() && interaction.customId === notificationsCommand.SELECT_MENU_ID) {
      await notificationsCommand.handleSelection(interaction);
      return;
    }

    if (!interaction.isButton()) return;
    if (interaction.customId !== 'rules_en' && interaction.customId !== 'rules_id') return;

    try {
      const lang = interaction.customId === 'rules_en' ? 'en' : 'id';
      const container = rulesCommand.buildContainer(lang);
      const file = new AttachmentBuilder('./assets/Rules.png', { name: 'Rules.png' });

      await interaction.reply({
        components: [container],
        files: [file],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral,
      });
    } catch (err) {
      console.error('Error saat handle button rules:', err);
      if (!interaction.replied) {
        await interaction.reply({ content: '⚠️ Terjadi error, cek log server.', ephemeral: true }).catch(() => {});
      }
    }
  },
};
