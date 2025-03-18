const { SlashCommandBuilder } = require('discord.js');
const { owner } = require('../../config.json'); // Obtém o ID do proprietário do bot

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nuke')
        .setDescription('Exclui e recria o canal de texto'),
    async execute(interaction) {
        // Verifica se o usuário que executou o comando é o proprietário
        if (interaction.user.id !== owner) {
            return interaction.reply({
                content: '🚫 | Você não tem permissão para usar este comando.',
                ephemeral: true
            });
        }

        const channel = interaction.channel;

        // Envia uma mensagem de confirmação de que o comando foi iniciado
        await interaction.reply({
            content: '🔄 | nukando canal',
            ephemeral: true
        });

        // Salva as configurações do canal (nome, posição, permissões)
        const channelName = channel.name;
        const position = channel.position;
        const overwrites = channel.permissionOverwrites.cache;

        // Exclui o canal atual
        await channel.delete();

        // Recria o canal com as configurações salvas
        const newChannel = await interaction.guild.channels.create({
            name: channelName,
            type: 'GUILD_TEXT',
            position: position,
            permissionOverwrites: overwrites
        });

        // Envia a mensagem de confirmação informando quem executou o comando
        await newChannel.send({
            content: `nuked by ${interaction.user.tag}`
        });

        // Envia a mensagem de sucesso após recriação do canal
        await interaction.editReply({
            content: `✅ | Canal nukado com sucesso`,
            ephemeral: true
        });
    },
};