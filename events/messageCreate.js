const { ABSENSI_CHANNEL_ID, RULES_CHANNEL_ID, ROLES_CHANNEL_ID } = require('../config/ids.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    const content = message.content.trim().toLowerCase();

    // Commands that take arguments, e.g. "!updateroles 1548210931568214059"
    const [cmd, ...args] = content.split(/\s+/);

    if (cmd === '!updateroles' && message.channel.id === ROLES_CHANNEL_ID) {
      const command = client.commands.get('roles');
      if (command && command.update) await command.update(message, args);
      return;
    }

    // Admin-only (checked inside update()); works in the channel where the color catalog message is
    if (cmd === '!updatecolors') {
      const command = client.commands.get('colors');
      if (command && command.update) await command.update(message, args);
      return;
    }

    if (content === '!rules' && message.channel.id === RULES_CHANNEL_ID) {
      const command = client.commands.get('rules');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!roles' && message.channel.id === ROLES_CHANNEL_ID) {
      const command = client.commands.get('roles');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!notifications') {
      const command = client.commands.get('notifications');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!colors') {
      const command = client.commands.get('colors');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!csnews') {
      const command = client.commands.get('csnews');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!mlbbnews') {
      const command = client.commands.get('mlbbnews');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!robloxnews') {
      const command = client.commands.get('robloxnews');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!gtanews') {
      const command = client.commands.get('gtanews');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!eafcnews') {
      const command = client.commands.get('eafcnews');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!rfnews') {
      const command = client.commands.get('rfnews');
      if (command) await command.execute(message);
      return;
    }

    if (content === '!abseninfo' && message.channel.id === ABSENSI_CHANNEL_ID) {
      const command = client.commands.get('abseninfo');
      if (command) await command.execute(message);
      return;
    }

    if (message.channel.id === ABSENSI_CHANNEL_ID) {
      const command = client.commands.get('absen');
      if (command) await command.execute(message);
      return;
    }
  },
};
