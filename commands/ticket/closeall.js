const { SlashCommandBuilder } = require('discord.js');
const { owner } = require('../../config.json'); // Obtém o ID do proprietário do bot

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closeall')
        .setDescription('Exclui todos os Tickets'),
    async execute(interaction) {
        // Verifica se o usuário que executou o comando é o proprietário
        if (interaction.user.id !== owner) {
            return interaction.reply({
                content: '🚫 | Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        // Envia mensagem inicial informando que os tickets estão sendo excluídos
        await interaction.reply({ content: '🔄 | Excluindo todos os Tickets', ephemeral: true });

        // Filtra todos os canais no servidor que começam com " 🎫・"
        const channelsToDelete = interaction.guild.channels.cache.filter(channel =>
            channel.name.startsWith("🎫・")
        );

        let deletedCount = 0;

        // Loop para deletar os canais encontrados
        for (const channel of channelsToDelete.values()) {
            try {
                // Se for um canal de texto, tentamos deletá-lo
                await channel.delete();
                deletedCount++;
            } catch (error) {
                console.error(`Não foi possível excluir o canal ${channel.name}:`, error);
            }
        }

        // Envia mensagem de sucesso após exclusão
        if (deletedCount > 0) {
            await interaction.editReply({ content: '🎉 | Todos os Tickets foram excluídos com sucesso', ephemeral: true });
        } else {
            await interaction.editReply({ content: '⚠️ | Nenhum Ticket encontrado para excluir', ephemeral: true });
        }
    },
};