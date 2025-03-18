const { ApplicationCommandType } = require("discord.js");
const { owner } = require("../../config.json");

module.exports = {
    name: "cleardm",
    description: "[ 👋🏻 Public ] Limpe Seu Cache de Mensagens da DM do bot",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {

        try {
            const dmChannel = await interaction.user.createDM();
            const fetchedMessages = await dmChannel.messages.fetch({ limit: 100 });

            const botMessages = fetchedMessages.filter(msg => msg.author.id === client.user.id);
            let totalMessages = botMessages.size;

            await interaction.reply({
                content: `🔄  | Apagando mensagens`,
                ephemeral: true
            });

            for (const msg of botMessages.values()) {
                await msg.delete();
            }

            await interaction.editReply({
                content: '`✅ Todas as mensagens do bot foram apagadas da sua DM.`',
                ephemeral: true
            });
        } catch (error) {
            await interaction.reply({
                content: '`❌ | Ocorreu um erro ao tentar limpar as mensagens da sua DM.`',
                ephemeral: true
            });
        }
    }
};