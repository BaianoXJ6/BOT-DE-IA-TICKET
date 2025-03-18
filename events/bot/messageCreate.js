const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Groq = require("groq-sdk");
const { general, tickets } = require("../../DataBaseJson");
const groq = new Groq({ apiKey: "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" });

module.exports = {
    name: "messageCreate",
    run: async (message, client) => {
        if (!message || !client) return;
        if (message.author.bot) return;

        const ticketInfo = tickets.get(`${message.channel.id}`);
        if (!ticketInfo) return;

        const ticketAssumido = tickets.get(`${message.channel.id}.assumido`);
        const statusIA = general.get("ticket.statusgermine");

        if (!statusIA) return;

        const papeisUsuario = message.member.roles.cache;
        const cargoStaff = general.get("ticket.definicoes.cargostaff");
        let ehStaff = false;

        if (Array.isArray(cargoStaff)) {
            ehStaff = cargoStaff.some(role => papeisUsuario.has(role));
        } else if (cargoStaff) {
            ehStaff = papeisUsuario.has(cargoStaff);
        };

        if (!ticketAssumido && ehStaff) {
            tickets.set(`${message.channel.id}.assumido`, true);

            const embedDesligar = new EmbedBuilder()
    .setAuthor({ name: `${message.guild.name} - Staff Assumiu` })  // Substitua interaction por message
    .setDescription(`A partir deste momento, um membro da equipe assumiu o controle do ticket!

Observação: A assistente virtual (IA) não será mais responsável por gerenciar este ticket. A partir de agora, todas as interações devem ser feitas diretamente com o membro da equipe responsável, ${message.author}. Fique à vontade para discutir qualquer questão ou dúvida com ele.`)
    .setColor("#00FF00")
    .setFooter({ text: `${message.guild.name}`, iconURL: message.guild.iconURL() })  // Substitua interaction por message
    .setTimestamp();

            await message.channel.send({ embeds: [embedDesligar], components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder().setCustomId(`msgSystem`).setLabel(`Mensagem do Sistema`).setStyle(2).setDisabled(true)
                )
            ] });
            return;
        }

        if (ticketAssumido) return;

        if (message.author.id === ticketInfo.dono) {
            const historicoChat = tickets.get(`${message.channel.id}.chat`) || [];
            const mensagemUsuario = message.content;
            const mensagemPrompt = general.get("ticket.germine.prompt") ||
                `Você é uma assistente de suporte. Responda em português de forma clara e direta ao problema descrito pelo usuário. Se você não souber a resposta, peça para aguardar o suporte humano. Responda o seguinte: "${mensagemUsuario}".`;

            historicoChat.push({ role: 'user', content: mensagemUsuario });
            tickets.set(`${message.channel.id}.chat`, historicoChat);

            await message.channel.sendTyping();

            try {
                const respostaIA = await groq.chat.completions.create({
                    messages: historicoChat.concat({ role: 'system', content: mensagemPrompt }),
                    model: "llama3-70b-8192",
                    temperature: 0,
                    max_tokens: 1024,
                });

                const mensagemIA = respostaIA.choices[0]?.message?.content || "Desculpe, não consegui gerar uma resposta agora.";

                await message.reply({ content: `${mensagemIA}` });

                historicoChat.push({ role: 'system', content: mensagemIA });
                tickets.set(`${message.channel.id}.chat`, historicoChat);
            } catch (erro) {
                await message.reply({ content: '`❌ Erro ao processar a resposta da IA.`', ephemeral: true });
            }
        }
    }
};;
