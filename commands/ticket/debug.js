const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { general } = require("../../DataBaseJson");
const { owner } = require("../../config.json");

module.exports = {
    name: "debug",
    description: "[ 🔒 Owner ] Verifica Erros no código do Bot",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        if (interaction.user.id !== owner) {
            return interaction.reply({ content: '`❌ | Você não tem permissão para isso.`', ephemeral: true });
        }

        const erros = [];

        try {
            const cargoStaff = general.get("ticket.definicoes.cargostaff");
            if (!cargoStaff) {
                erros.push("`❌ Cargo de staff não configurado.`");
            }

            const logsStaff = general.get("ticket.definicoes.logsstaff");
            if (!logsStaff) {
                erros.push("`❌ Canal de logs de staff não configurado.`");
            }

            const categoriaTicket = general.get("ticket.definicoes.categoriaticket");
            if (!categoriaTicket) {
                erros.push("`❌ Categoria de tickets não configurada.`");
            }

            const banner = general.get("ticket.aparencia.banner");
            if (banner && !isValidImageUrl(banner)) {
                erros.push("`❌ URL de banner inválida.`");
            }

            const miniatura = general.get("ticket.aparencia.miniatura");
            if (miniatura && !isValidImageUrl(miniatura)) {
                erros.push("`❌ URL de miniatura inválida.`");
            }

            const emojiBotao = general.get("ticket.botao.emoji");
            if (emojiBotao && !isValidEmoji(emojiBotao)) {
                erros.push("`❌ Emoji do botão inválido.`");
            }

            const mensagemTicket = general.get("ticket.aparencia.content");
            if (!mensagemTicket || mensagemTicket.trim() === "") {
                erros.push("`❌ A mensagem do painel de ticket não está configurada.`");
            }

            const tituloTicket = general.get("ticket.aparencia.titulo");
            if (!tituloTicket || tituloTicket.trim() === "") {
                erros.push("`❌ O título do ticket não está configurado.`");
            }

            const descricaoTicket = general.get("ticket.aparencia.descricao");
            if (!descricaoTicket || descricaoTicket.trim() === "") {
                erros.push("`❌ A descrição do ticket não está configurada.`");
            }

            const funcoes = general.get("ticket.funcoes") || [];
            funcoes.forEach((funcao, index) => {
                if (!funcao.nome) {
                    erros.push(`\`❌ A função número ${index + 1} não tem um nome configurado.\``);
                }
                if (!funcao.preDescricao) {
                    erros.push(`\`❌ A função "${funcao.nome}" não tem uma pré-descrição configurada.\``);
                }
                if (funcao.emoji && !isValidEmoji(funcao.emoji)) {
                    erros.push(`\`❌ O emoji da função "${funcao.nome}" é inválido.\``);
                }
                if (funcao.banner && !isValidImageUrl(funcao.banner)) {
                    erros.push(`\`❌ O banner da função "${funcao.nome}" é uma URL inválida.\``);
                }
            });

            if (typeof general.get !== 'function') {
                erros.push("`❌ A função de obtenção de dados da database está incorreta.`");
            }

            if (!client || !client.user) {
                erros.push("`❌ Erro ao obter o cliente ou usuário do bot.`");
            }

        } catch (error) {
            erros.push("`❌ Erro inesperado ao verificar as configurações.`");
        }

        if (erros.length === 0) {
            return interaction.reply({
                content: "`✅ Nenhum erro encontrado. Todas as configurações estão corretas.`",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.guild.name} - Sistema Debug` }) // Correção aqui
            .setDescription(`🔴  | Verificação de Erros\n\n${erros.map(erro => `- ${erro}`).join("\n")}`) // Correção aqui
            .setColor("#FF0000")
            .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId(`ErrorsLength`)
                    .setLabel(`Errors: x${erros.length}`)
                    .setStyle(2)
                    .setDisabled(true)
                )
            ],
            ephemeral: true
        });

        function isValidImageUrl(url) {
            const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            const urlWithoutParams = url.split('?')[0];
            return validExtensions.some(ext => urlWithoutParams.toLowerCase().endsWith(ext));
        }

        function isValidEmoji(emoji) {
            const emojiRegex = /^<a?:\w+:\d+>$|^[\p{Emoji}]$/u;
            return emojiRegex.test(emoji);
        }
    }
};