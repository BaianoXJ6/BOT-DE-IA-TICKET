const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { owner } = require("../../config.json")


module.exports = {
    name:"rdefaults", 
    description:"[ 🔒 Owner] Realizar um reset nas configurações do sistema.", 
    type: ApplicationCommandType.ChatInput,
    run: async(client, interaction) => { 

        if(interaction.user.id !== owner ) {
            return interaction.reply({ content: '\`❌ Você não tem permissão para isso\`', ephemeral: true })
        }

        const embed = new EmbedBuilder()
        .setAuthor({ name: `${interaction.guild.name} - Reset Configurations`})
        .setDescription(`Confirmação de Reset das Configurações  

Atenção: Esta ação irá redefinir completamente o banco de dados e todos os dados armazenados no sistema atual.  

Clique em **Confirmar** para prosseguir ou **Cancelar** para interromper a ação.`)
        .setColor("#00FFFF")
        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
        .setTimestamp()

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
            .setCustomId("resetarconfigs")
            .setLabel("Confirmar")
            .setEmoji("1303149098135982212")
            .setStyle(3),
            new ButtonBuilder()
            .setCustomId("cancelarresetconfigs")
            .setLabel("Cancelar")
            .setEmoji("1303149111742038128")
            .setStyle(4),
        )

        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true })

    }
};