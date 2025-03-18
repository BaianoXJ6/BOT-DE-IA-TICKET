const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { general } = require("../DataBaseJson");

async function payments(interaction, client) {
  const sistemaMp = await general.get("auto.sistemaMp") || false;
  const mp = await general.get("auto.mp") || null;

  const sistemaSemi = await general.get("semi.sistema") || false;
  const chave = await general.get("semi.chave") || null;

  interaction.update({
    content: ``,
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild.name} - Gerenciamento` })
        .setDescription(`Olá ${interaction.user}, Bem-vindo ao Sistema de Pagamentos do Bot. Use os botões abaixo para escolher seu sistema.`)
        .addFields(
          { 
            name: `Sistema Automático`, 
            value: `${sistemaMp ? "`🟢 | Online` **Sistema**" : "`🔴 | Offline` **Sistema**"}\n${mp ? "\`(📡 | RUNNING)\` **API**" : "\`(🔎 | NOT FOUND)\` **API**"}`,
            inline: true 
          },
          { 
            name: `Sistema Semi Auto`, 
            value: `${sistemaSemi ? "`🟢 | Online` **Sistema**" : "`🔴 | Offline` **Sistema**"}\n${chave ? "\`(📫 | SETADA)\` **Chave**" : "\`(🔎 | NOT FOUND)\` **Chave**"}`,
            inline: true 
          }
        )
        .setColor(`#00FFFF`)
        .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`automaticConfig`).setLabel(`Configurar Automático`).setEmoji(`🔧`).setStyle(1),
          new ButtonBuilder().setCustomId(`semiAutoConfig`).setLabel(`Configurar Semi Auto`).setEmoji(`⚙️`).setStyle(1)
        ),
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`voltar00`).setEmoji(`⬅️`).setStyle(2)
        )
    ]
  });
}

async function automatic(interaction, client) {
  const sistemaMp = await general.get("auto.sistemaMp") || false;
  const mp = await general.get("auto.mp") || null;
  const banksOffArray = await general.get("auto.banksOff") || [];
  const banksOff = banksOffArray.length > 0 ? `\`\`\`${banksOffArray.join("\n")}\`\`\`` : "`Nenhum`";

  interaction.update({
    content: ``,
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild.name} - Gerenciamento` })
        .setDescription(`Olá ${interaction.user}, Bem-vindo ao Painel de Gerenciamento do Sistema Automático.

Observação: Na área de automação de pagamento, você otimiza o processo, eliminando a necessidade de aprovação manual de carrinhos criados. Utilize as funções abaixo para configurar a Credencial do Access Token e bloquear bancos com índices elevados de fraudes.`)
        .addFields(
          { name: `Sistema`, value: sistemaMp ? "`🟢 Online`" : "`🔴 Offline`" },
          { name: `Token:`, value: mp ? `\`\`\`${mp.slice(0, -33) + '***************************'}\`\`\`` : "`🔴 Não configurado.`" },
          { name: `Bancos Bloqueados`, value: banksOff }
        )
        .setColor(`#00FFFF`)
        .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`sistemaMpOnOff`).setLabel(sistemaMp ? "Online" : "Offline").setEmoji(sistemaMp ? "✅" : "❌").setStyle(sistemaMp ? 3 : 4),
          new ButtonBuilder().setCustomId(`setAccessToken`).setLabel(`Setar Access Token`).setEmoji(`🔑`).setStyle(1),
          new ButtonBuilder().setCustomId(`antFraudSet`).setLabel(`SafePay`).setEmoji(`🛡️`).setStyle(2)
        ),
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`chaveReciboConfig`).setEmoji(`⬅️`).setStyle(2)
        )
    ]
  });
}

async function semiAuto(interaction, client) {
  const sistemaSemi = await general.get("semi.sistema") || false;
  const chave = await general.get("semi.chave") || null;
  const roleAprove = await general.get("semi.roleAprove") || null;

  interaction.update({
    content: ``,
    embeds: [
      new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild.name} - Gerenciamento` })
        .setDescription(`Olá ${interaction.user}, Bem-vindo ao Painel de Gerenciamento do Sistema Semi-Automático.

Observação: O sistema Semi-Automático é uma solução útil para aqueles que não utilizam o Mercado Pago. Nesse modelo, a aprovação dos pagamentos é feita manualmente para validar as transações de aluguel da loja.

Configure os parâmetros Tipo/Chave e Cargo Aprovador conforme necessário.`)
        .addFields(
          { name: `Sistema`, value: sistemaSemi ? "`🟢 Online`" : "`🔴 Offline`" },
          { name: `Pix:`, value: chave ? "`🟢 Configurado`" : "`🔴 Não configurado.`" },
          { name: `Cargo Aprovador`, value: roleAprove ? `<@&${roleAprove}>` : "`🔴 Não configurado.`" }
        )
        .setColor(`#00FFFF`)
        .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp()
    ],
    components: [
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`sistemaSemiOnOff`).setLabel(sistemaSemi ? "Online" : "Offline").setEmoji(sistemaSemi ? "✅" : "❌").setStyle(sistemaSemi ? 3 : 4),
          new ButtonBuilder().setCustomId(`setAgenceSemi`).setLabel(`Gerenciar PIX e Aprovador`).setEmoji(`🔄`).setStyle(1)
        ),
      new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder().setCustomId(`chaveReciboConfig`).setEmoji(`⬅️`).setStyle(2)
        )
    ]
  });
}

module.exports = {
  payments,
  automatic,
  semiAuto
};