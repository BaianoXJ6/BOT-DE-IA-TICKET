const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, ChannelSelectMenuBuilder, ChannelType, RoleSelectMenuBuilder, ModalBuilder, TextInputBuilder, AttachmentBuilder } = require("discord.js");
const { payments, automatic, semiAuto, setAgenceSemi } = require("../../Functions/payments");
const { general, tickets } = require("../../DataBaseJson");
const mercadopago = require("mercadopago");
const axios = require("axios");

module.exports = {
    name: "interactionCreate",
    run: async (interaction, client) => {
        const { customId } = interaction;
        if (!customId) return;

        if (customId === "automaticPay") {

            if (!general.get("auto.mp")) {
                return interaction.reply({ content: `\`❌\` A forma de pagamento não foi configurada ainda!`, ephemeral: true });
            }

            const modal = new ModalBuilder()
                .setCustomId(`modalAutoPay`)
                .setTitle(`Realizar Pagamento`);

            const option1 = new TextInputBuilder()
                .setCustomId(`valor`)
                .setLabel(`QUAL SERÁ O VALOR DE PAGAMENTO?`)
                .setPlaceholder(`EX: 10 (NÃO USE VÍRGULA, APENAS PONTO)`)
                .setStyle("Short");

            const optionx1 = new ActionRowBuilder().addComponents(option1);

            modal.addComponents(optionx1);
            await interaction.showModal(modal);

        }

        if (customId === "modalAutoPay") {
            const valor = parseFloat(interaction.fields.getTextInputValue("valor")).toFixed(2);

            if (isNaN(valor)) {
                return interaction.reply({ content: `\`❌\` Isso não é um valor válido!`, ephemeral: true });
            }

            if (valor.includes(",")) {
                return interaction.reply({ content: `\`❌\` Não use vírgulas, apenas pontos!`, ephemeral: true });
            }

            if (valor <= 0) {
                return interaction.reply({ content: `\`❌\` O valor não pode ser menos que \`R$0.01\`!`, ephemeral: true });
            }

            pagamento(Number(valor).toFixed(2));

        }

        if (customId === "copyCode") {

            const codigo = await tickets.get("copyCod");

            interaction.reply({
                content: codigo,
                ephemeral: true
            });

        }

        async function pagamento(valor) {

            const mp = await general.get("auto.mp") || null;

            const payment_data = {
                transaction_amount: Number(valor),
                description: `Cobrança - ${interaction.user.username}`,
                payment_method_id: "pix",
                payer: {
                    email: `${interaction.user?.id}@gmail.com`,
                }
            };

            mercadopago.configurations.setAccessToken(mp);
            await mercadopago.payment.create(payment_data)
                .then(async (paymentResponse) => {

                    const data = paymentResponse.body;
                    const qrCode = data.point_of_interaction.transaction_data.qr_code;
                    const { qrGenerator } = require('../../Lib/QRCodeLib');
                    const qr = new qrGenerator({ imagePath: './Lib/aaaaa.png' });
                    const qrcode = await qr.generate(qrCode);

                    const buffer = Buffer.from(qrcode.response, "base64");
                    const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

                    const embed = new EmbedBuilder()
                        .setAuthor({ name: `${interaction.user.username} - Pendência Pagamento Criada`, iconURL: interaction.user.displayAvatarURL() })
                        .setDescription(`-# \`✅\` Pendência para realizar pagamento criada.\n-# \`❓\` Entrega automática após pagamento.\n\n**Código copia e cola:**\n\`\`\`${qrCode}\`\`\``)
                        .addFields(
                            { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                            { name: `Verificação`, value: `\`⚡ Automática\``, inline: true }
                        )
                        .setColor(`#00FFFF`)
                        .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                        .setTimestamp();

                    embed.setImage(`attachment://payment.png`);

                    interaction.update({
                        content: `${interaction.user}`,
                        embeds: [embed],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder().setCustomId(`copyCode`).setLabel(`MobileService`).setEmoji(`1218967168960434187`).setStyle(1),
                                    new ButtonBuilder().setURL(data.point_of_interaction.transaction_data.ticket_url).setLabel(`Pagar por site`).setEmoji(`1302020475760934973`).setStyle(5)
                                )
                        ],
                        files: [attachment]
                    }).then(async (msg) => {

                        await tickets.set("copyCod", qrCode);

                        const checkPaymentStatus = setInterval(() => {
                            axios.get(`https://api.mercadopago.com/v1/payments/${data?.id}`, {
                                headers: {
                                    'Authorization': `Bearer ${mp}`
                                }
                            }).then(async (doc) => {

                                if (doc?.data.status === "approved") {
                                    clearInterval(checkPaymentStatus);

                                    const blockedBanks = await general.get("auto.banksOff") || [];
                                    const longName = doc?.data.point_of_interaction.transaction_data.bank_info.payer.long_name?.toLowerCase();
                                    const encontrado = blockedBanks.some(banco => longName.includes(banco.toLowerCase()));

                                    if (encontrado) {

                                        await msg.edit({
                                            content: `${interaction.user}`,
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setAuthor({ name: `${interaction.user.username} - Anti Fraude Detectada`, iconURL: interaction.user.displayAvatarURL() })
                                                    .setDescription(`-# \`🔎\` Por questão de segurança, seu pagamento com o banco \`${doc.data.point_of_interaction.transaction_data.bank_info.payer.long_name}\` foi cancelado.\n-# \`❓\` Está em dúvida ou precisa de ajuda com algo? Contate o suporte!`)
                                                    .addFields(
                                                        { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                                                        { name: `Verificação`, value: `\`⚡ Automática\``, inline: true },
                                                        { name: `User/Banco`, value: `${interaction.user || "\`🔴 Não encontrado.\`"}/\`${doc.data.point_of_interaction.transaction_data.bank_info.payer.long_name || "\`🔴 Não encontrado.\`"}\`` }
                                                    )
                                                    .setColor(`#FF0000`)
                                                    .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                                                    .setTimestamp()
                                            ],
                                            components: [],
                                            files: []
                                        }).catch(error => { });

                                        if (await general.get("ticket.definicoes.logsstaff")) {
                                            const channel = interaction.guild.channels.cache.get(general.get("ticket.definicoes.logsstaff"));

                                            channel.send({
                                                content: ``,
                                                embeds: [
                                                    new EmbedBuilder()
                                                        .setAuthor({ name: `${interaction.user.username} - Anti Fraude Detectada`, iconURL: interaction.user.displayAvatarURL() })
                                                        .setDescription(`-# \`❌\` Pagamento cancelado por **Anti Fraude Detectada**.`)
                                                        .addFields(
                                                            { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                                                            { name: `Verificação`, value: `\`⚡ Automática\``, inline: true },
                                                            { name: `User/Banco`, value: `${interaction.user || "\`🔴 Não encontrado.\`"}/\`${doc.data.point_of_interaction.transaction_data.bank_info.payer.long_name || "\`🔴 Não encontrado.\`"}\`` }
                                                        )
                                                        .setColor(`#FF0000`)
                                                        .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                                                        .setTimestamp()
                                                ],
                                                components: [
                                                    new ActionRowBuilder()
                                                        .addComponents(
                                                            new ButtonBuilder().setCustomId(`botN`).setLabel(`Notificação do Anti Fraude`).setStyle(2).setDisabled(true)
                                                        )
                                                ]
                                            }).catch(error => { });

                                        };

                                        const axios = require('axios');
                                        await axios.post(`https://api.mercadopago.com/v1/payments/${data?.id}/refunds`, {}, {
                                            headers: {
                                                'Authorization': `Bearer ${mp}`
                                            }
                                        }).catch(error => { });

                                        return;

                                    };

                                    await msg.edit({
                                        content: `${interaction.user}`,
                                        embeds: [
                                            new EmbedBuilder()
                                                .setAuthor({ name: `${interaction.user.username} - Pagamento Realizado`, iconURL: interaction.user.displayAvatarURL() })
                                                .setDescription(`-# \`✅\` Seu pagamento com o banco \`${doc.data.point_of_interaction.transaction_data.bank_info.payer.long_name || "\`🔴 Não encontrado.\`"}\` foi realizado com êxito.`)
                                                .addFields(
                                                    { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                                                    { name: `Verificação`, value: `\`⚡ Automática\``, inline: true }
                                                )
                                                .setColor(`#00FF00`)
                                                .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                                                .setTimestamp()
                                        ],
                                        components: [],
                                        files: []
                                    }).catch(error => { });

                                    if (await general.get("ticket.definicoes.logsstaff")) {
                                        const channel = interaction.guild.channels.cache.get(general.get("ticket.definicoes.logsstaff"));

                                        channel.send({
                                            content: ``,
                                            embeds: [
                                                new EmbedBuilder()
                                                    .setAuthor({ name: `${interaction.user.username} - Pagamento Realizado`, iconURL: interaction.user.displayAvatarURL() })
                                                    .setDescription(`-# \`✅\` O pagamento de ${interaction.user || "\`🔴 Não encontrado.\`"} com o banco \`${doc.data.point_of_interaction.transaction_data.bank_info.payer.long_name || "\`🔴 Não encontrado.\`"}\` foi realizado com êxito.`)
                                                    .addFields(
                                                        { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                                                        { name: `Verificação`, value: `\`⚡ Automática\``, inline: true },
                                                        { name: `User/Banco`, value: `${interaction.user || "\`🔴 Não encontrado.\`"}/\`${doc.data.point_of_interaction.transaction_data.bank_info.payer.long_name || "\`🔴 Não encontrado.\`"}\`` }
                                                    )
                                                    .setColor(`#00FF00`)
                                                    .setFooter({ text: `${interaction.user.displayName}`, iconURL: interaction.user.displayAvatarURL() })
                                                    .setTimestamp()
                                            ],
                                            components: [
                                                new ActionRowBuilder()
                                                    .addComponents(
                                                        new ButtonBuilder().setCustomId(`botM`).setLabel(`Mensagem do Sistema`).setStyle(2).setDisabled(true)
                                                    )
                                            ]
                                        }).catch(error => { });

                                    };

                                } else { };

                            });
                        }, 2000);

                    });

                });

        }

    }
};