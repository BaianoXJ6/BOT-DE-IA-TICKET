const { EmbedBuilder, ApplicationCommandType, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder } = require("discord.js");
const { general } = require("../DataBaseJson");

async function configbotao(interaction, client) {
  const config = general.get("ticket.botao") || [];
  const row24 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Button Preview")
      .setCustomId("configbotaoteste2024random")
      .setEmoji(config.emoji || "1240863968042418247")
      .setStyle(config.style || 2)
      .setDisabled(true)
  );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("configemojibotao")
      .setLabel("Emoji Button")
      .setEmoji("1246955047280185385")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configcorbotao")
      .setLabel("Style Button")
      .setEmoji("1294425656796381219")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("configaparencia")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  );

  interaction.update({
    content: `O que deseja personalizar no botão de atendimento?`,
    components: [row24, row],
    ephemeral: true
  });
}

async function configinteligenciaartifial(interaction, client) {
  const status = await general.get("ticket.statusgermine") || false;
  const prompt = await general.get("ticket.germine.prompt") || "🔴 Não configurado.";

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Assistente Virtual ( IA )` })
    .setDescription(`-# Olá ${interaction.user}, Bem-vindo ao Painel de Gerenciamento da sua Assistente Virtual ( IA )
    
    Observação: Caso um usuário faça uma pergunta, como por exemplo, sobre "Nitro" ou algo do tipo, e necessário que uma resposta associada a esse tema tenha sido previamente configurada, a Assistente Virtual ( IA ) responderá automaticamente com a mensagem associada ao prompt configurado.`)
    .setColor("#00FFFF")
    .addFields(
      { name: `AI System:`, value: `${status ? '🟢 | Online' : '🔴 | Offline'}`, inline: true },
      { name: `Prompt Atual:`, value: `\`${prompt}\``, inline: true }
    )
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("statusgermine")
      .setLabel(status ? 'Online' : 'Offline')
      .setEmoji(status ? "1236021048470933575" : "1236021106662707251")
      .setStyle(status ? 3 : 4),
    new ButtonBuilder()
      .setCustomId("configurarprompt")
      .setLabel("Configurar Prompt")
      .setEmoji("1302020615192187031")
      .setStyle(1),
    new ButtonBuilder()
      .setCustomId("voltar00")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  );

  interaction.update({
    components: [row],
    embeds: [embed4],
    ephemeral: true
  });
}

async function configfuncoes(interaction, client) {
  const statusRenomear = general.get("ticket.functions.renomear") || false;
  const statusMotivo = general.get("ticket.functions.motivo_ticket") || false;
  const statusRemoverUsuario = general.get("ticket.functions.remover_usuario") || false;
  const statusAdicionarUsuario = general.get("ticket.functions.adicionar_usuario") || false;
  const statusPoker = general.get("ticket.functions.poker") || false;

  const embed4 = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Funções Ticket` })
    .setDescription(`-# Olá ${interaction.user}, Bem-vindo ao Painel de Gerenciamento das Funções do seu Ticket utilize os botões abaixo para configurar`)
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('configuracoesFuncoes')
    .setPlaceholder('Opções Disponíveis')
    .addOptions(
      {
        label: 'Notificar User',
        description: `${statusPoker ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1302020863339663370",
        value: '4324324432poker',
      },
      {
        label: 'Renomear',
        description: `${statusRenomear ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1284680830043557888",
        value: '243234renomear',
      },
      {
        label: 'Adicionar Usuário',
        description: `${statusAdicionarUsuario ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1284680870497620009",
        value: '34242344adicionar_usuario',
      },
      {
        label: 'Remover Usuário',
        description: `${statusRemoverUsuario ? '🟢 Habilitado' : '🔴 Desabilitado'}`,
        emoji: "1277488588442828830",
        value: '234234234remover_usuario',
      }
    );

  const row4 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setEmoji("1246953097033416805")
      .setStyle(2)
  );

  const row = new ActionRowBuilder().addComponents(selectMenu);

  interaction.update({
    components: [row, row4],
    embeds: [embed4],
    ephemeral: true
  });
}

async function painelticket(interaction, client) {
  const funcoesConfiguradas = await general.get("ticket.funcoes") || [];

  const tipomsg = general.get("ticket.tipoenviarmsgtckt") || false;
  const statusabertura = general.get("ticket.statusabertura") || false;

  const embed = new EmbedBuilder()
    .setAuthor({ name: `${interaction.guild.name} - Gerenciamento Sistema Ticket` })
    .setDescription(`-# Olá ${interaction.user}, Utilize os botoes abaixo para configurar o sistema do seu Ticket`)
    .addFields(
      { name: `Categorias`, value: `\`x${funcoesConfiguradas.length}\``, inline: true },
      { name: `Abertura`, value: `\`${tipomsg ? "Select Menu" : "Botões"}\``, inline: true },
      { name: `Ticket Mode:`, value: `\`${statusabertura ? "Tópico" : "Categoria"}\``, inline: true }
    )
    .setColor("#00FFFF")
    .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
    .setTimestamp();

  const row2 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("add_funcao")
      .setLabel("Adicionar Função")
      .setStyle(3)
      .setEmoji("1246953350067388487"),
    new ButtonBuilder()
      .setCustomId("remover_funcao")
      .setLabel("Remover Função")
      .setStyle(4)
      .setEmoji("1246953338541441036")
      .setDisabled(funcoesConfiguradas.length === 0),
    new ButtonBuilder()
      .setCustomId("editar_funcao")
      .setLabel("Editar Categoria")
      .setStyle(2)
      .setEmoji("1246953149009367173")
      .setDisabled(funcoesConfiguradas.length === 0)
  );

  const row3 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("ver_funcoes")
      .setLabel("Ver Categorias")
      .setStyle(1)
      .setDisabled(funcoesConfiguradas.length === 0)
      .setEmoji("1246954883182100490"),
    new ButtonBuilder()
      .setCustomId("postar")
      .setLabel("Postar")
      .setStyle(1)
      .setDisabled(funcoesConfiguradas.length === 0)
      .setEmoji("1302021031866929224"),
    new ButtonBuilder()
      .setCustomId("sincronizar")
      .setLabel("Sincronizar")
      .setStyle(2)
      .setDisabled(funcoesConfiguradas.length === 0)
  );

  const row4 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("trocarselect")
      .setLabel(tipomsg ? "Usar Botão" : "Usar Select")
      .setEmoji("1246953228655132772")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId("trocaraberturaticket2024")
      .setLabel(statusabertura ? "Mode Tópico" : "Mode Category")
      .setEmoji("1302019349296713769")
      .setStyle(3),
    new ButtonBuilder()
      .setCustomId("ticketconfig2024")
      .setStyle(2)
      .setEmoji("1246953097033416805")
  );

  interaction.update({
    embeds: [embed],
    components: [row2, row3, row4],
    ephemeral: true
  });
}

module.exports = {
  configbotao,
  configinteligenciaartifial,
  configfuncoes,
  painelticket
};