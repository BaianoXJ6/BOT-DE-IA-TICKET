const { ActivityType, EmbedBuilder, Events, WebhookClient } = require("discord.js");
const axios = require("axios");
const config = require("../../config.json");

module.exports = {
    name: "ready",
    run: async (client) => {
        console.clear();
        console.log('> Developer: @lv.7_.');
        console.log('> Apps: Brasil Solutions');
        console.log(`> Bot: Bot Online com sucesso em ${client.user.tag}`);

        const { token } = require("../../config.json");

        // Função para mudar a descrição do bot
        const mudardesc = () => {
            const description = `**- Baiano XJ6**`;
            axios.patch(`https://discord.com/api/v10/applications/${client.user.id}`, {
                description: description
            }, {
                headers: {
                    "Authorization": `Bot ${token}`,
                    "Content-Type": 'application/json',
                }
            });
        };

        // Atividades personalizadas para o bot
        const customActivities = [
            { name: "BaianoXJ6", type: ActivityType.Playing }
        ];
      
        const updateActivity = () => {
            const randomActivity = customActivities[Math.floor(Math.random() * customActivities.length)];
            client.user.setPresence({
                activities: [randomActivity],
                status: "online",
            });
        };

        // Atualiza a descrição do bot a cada 5 minutos
        mudardesc();
        setInterval(mudardesc, 300000); // 300000 ms = 5 minutos
    }
};                     