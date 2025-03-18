const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { general } = require("../DataBaseJson");

async function config(interaction, client) {
  const status = general.get("ticket.status") || false;

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Gerenciamento Inicial` })
    .setDescription(`Olá ${interaction.user}, seja bem-vindo ao Painel de Gerenciamento do seu Ticket V1. Explore as opções abaixo e utilize os botões para personalizar as configurações de acordo com suas necessidades.`)
    .setColor("#00FFFF")
    .addFields(
      { name: `Sistema:`, value: `${status ? '\`🟢 Online\`' : '\`🔴 Offline\`'}`, inline: true },
      { name: `Ping:`, value: `\`${client.ws.ping} ms\``, inline: true },
      { name: `Uptime:`, value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
    )
    .setFooter({ text: `${interaction.guild.name} - Todos direitos reservados`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("statusticket")
      .setLabel(status ? 'Online' : 'Offline')
      .setEmoji(status ? "1236021048470933575" : "1236021106662707251")
      .setStyle(status ? 3 : 4),
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setLabel("Ticket")
      .setEmoji("1246953296321577020")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("inteligenciaartificial")
      .setLabel("Assistente Virtual ( IA )")
      .setEmoji("1302021031866929224")
      .setStyle(1)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("chaveReciboConfig")
      .setLabel("Pagamentos")
      .setEmoji("1302019361623769281")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configuracoes")
      .setLabel("Logs/Canais")
      .setEmoji("1302020457276375050")
      .setStyle(2)
  );

  if (interaction.message == undefined) {
    interaction.reply({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true });
  } else {
    interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true });
  }
}

async function configuracoes(interaction, client) {
  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Gerenciamento Canais/Logs` })
    .setDescription(`-# Painel de Gerenciamento dos **Canais/Logs**`)
    .setColor("#00FFFF")
    .addFields(
      { name: `Logs Staff`, value: `${general.get("ticket.definicoes.logsstaff") ? `<#${general.get("ticket.definicoes.logsstaff")}>` : `\`🔴 Não configurado.\``}` },
      { name: `Cargo Suporte`, value: `${general.get("ticket.definicoes.cargostaff") ? `<@&${general.get("ticket.definicoes.cargostaff")}>` : `\`🔴 Não configurado.\``}` },
      { name: `Categoria Tickets`, value: `${general.get("ticket.definicoes.categoriaticket") ? `<#${general.get("ticket.definicoes.categoriaticket")}>` : `\`🔴 Não configurado.\``}` },
    )
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("alterarlogs")
      .setLabel("Logs Staffs")
      .setEmoji("1302020493779402872")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("alterarcargostaff")
      .setLabel("Cargo Suporte")
      .setEmoji("1246955036433453259")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("alterarcategoriaticket")
      .setLabel("Categoria Tickets")
      .setEmoji("1302019349296713769")
      .setStyle(1)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("voltar00")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  );

  interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true });
}

async function configticket(interaction, client) {
  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Gerenciamento Estrutura` })
    .setDescription(`-# Configure a Estrutura do seu Ticket Abaixo`)
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("configticket")
      .setLabel("Sistema")
      .setEmoji("1246954897509847194")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configaparencia")
      .setLabel("Aparência")
      .setEmoji("1246953386797174835")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("funcoesticket")
      .setLabel("Funções")
      .setEmoji("1297641727359979701")
      .setStyle(1),
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("voltar00")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  );

  interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true });
}

async function aparencia(interaction, client) {
  const status = general.get("ticket.tipomsg") || false;
  const bannerUrl = general.get("ticket.aparencia.banner") || null;
  const miniaturaUrl = general.get("ticket.aparencia.miniatura") || null;

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Gerenciamento Aparência` })
    .setDescription(`-# Bem Vindo ao Painel de **Aparência Ticket**`)
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  if (status) {
    embed4.addFields(
      { name: `Mode Send`, value: "\`🎨 Content\`" },
      { name: `Mensagem`, value: `\`\`\`${general.get("ticket.aparencia.content") || "👋🏻 | Olá, utilize o botão abaixo para abrir um ticket"}\`\`\`` },
      { name: `Banner`, value: bannerUrl ? `[Abrir Imagem](${bannerUrl})` : "\`🔴 Não configurado.\`" }
    );
  } else {
    embed4.addFields(
      { name: `Mode Send`, value: "\`🎨 Embed\`" },
      { name: `Informações`, value: `**Título:** \`${general.get("ticket.aparencia.titulo") || "Atendimento ao cliente"}\`\n**Descrição:** \`${general.get("ticket.aparencia.descricao") || "👋 Olá, utilize o botão abaixo para abrir um ticket"}\`\n**Color:** \`${general.get("ticket.aparencia.cor") || "#000000"}\`` },
      { name: `Imagens`, value: `**Banner:** ${bannerUrl ? `[Abrir Imagem](<${bannerUrl}>)` : "\`🔴 Não configurado.\`"}\n**Miniatura:** ${miniaturaUrl ? `[Abrir Imagem](<${miniaturaUrl}>)` : "\`🔴 Não configurado.\`"}` }
    );
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("gerenciaraparencia")
      .setLabel("Personalizar Design")
      .setEmoji("1294425656796381219")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("gerenciatipo")
      .setLabel(status ? "Mode Content" : "Mode Embed")
      .setEmoji("1297641351164203120")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId("configbotao")
      .setLabel("Button Config")
      .setEmoji("1297641727359979701")
      .setStyle(1)
  );

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  );

  interaction.update({ content: ``, components: [row, row2], content: '', embeds: [embed4], ephemeral: true });
}

module.exports = {
  config,
  configuracoes,
  configticket,
  aparencia
};