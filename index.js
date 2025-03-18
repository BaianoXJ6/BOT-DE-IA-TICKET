const { Client, GatewayIntentBits, Collection, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const axios = require("axios");
console.clear();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping
  ],
  partials: [
    Partials.Message,
    Partials.Channel
  ]
});

module.exports = client;
client.slashCommands = new Collection();
const { token } = require("./config.json");
client.login(token);

const evento = require("./handler/Events");
evento.run(client);
require("./handler/index")(client);




client.on('messageCreate', (message) => {
  if (message.mentions.has(client.user, { ignoreEveryone: true, ignoreRoles: true }) && !message.reference) {
    const description24 = `**Bot exclusivo** do servidor \`${message.guild.name}\`\nOperando na versão mais recente do **ISoTicket**\nDesenvolvido pela **[DreamApps](https://discord.gg/dreamapps)**`;

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("4444444444444432544244354352ucy2hsjkqnf2j3525")
        .setLabel("Powered By DreamApps")
        .setEmoji("1246955239572246668")
        .setStyle(1)
    );

    const embed = new EmbedBuilder()
      .setDescription(description24)
      .setColor("#00FFFF");

    message.reply({ content: `<@${message.author.id}>`, embeds: [embed], components: [row] }).then(sentMessage => {
      setTimeout(() => {
        sentMessage.delete().catch(err => console.error(err));
      }, 10000);
    }).catch(err => console.error(err));
  }
});



