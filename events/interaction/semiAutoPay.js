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

        if (customId === "semiAutoPay") {

            if (!general.get("semi.chave")) {
                return interaction.reply({ content: `\`❌\` A forma de pagamento não foi configurada ainda!`, ephemeral: true });
            };

            const modal = new ModalBuilder()
                .setCustomId(`modalAutoPay2`)
                .setTitle(`Realizar Pagamento`)

            const option1 = new TextInputBuilder()
                .setCustomId(`valor`)
                .setLabel(`QUAL SERÁ O VALOR DE PAGAMENTO?`)
                .setPlaceholder(`EX: 10 (NÃO USE VÍRGULA, APENAS PONTO)`)
                .setStyle("Short")

            const optionx1 = new ActionRowBuilder().addComponents(option1);

            modal.addComponents(optionx1);
            await interaction.showModal(modal);

        };

        if (customId === "modalAutoPay2") {
            const valor = parseFloat(interaction.fields.getTextInputValue("valor")).toFixed(2);

            if (isNaN(valor)) {
                return interaction.reply({ content: `\`❌\` Isso não é um valor válido!`, ephemeral: true });
            };

            if (valor.includes(",")) {
                return interaction.reply({ content: `\`❌\` Não use vírgulas, apenas pontos!`, ephemeral: true });
            };

            if (valor <= 0) {
                return interaction.reply({ content: `\`❌\` O valor não pode ser menos que \`R$0.01\`!`, ephemeral: true });
            };

            await tickets.delete("status");

            pagamento(Number(valor).toFixed(2));

        };

        if (customId === "copyChave") {

            const chave = await general.get("semi.chave");

            interaction.reply({
                content: chave,
                ephemeral: true
            });

        };

        if (customId === "aproveSemiAuto") {

            if (!general.get("semi.roleAprove")) {
                return interaction.reply({ content: `\`🔎\` Cargo de aprovador não setado!`, ephemeral: true });
            };

            if (!interaction.member.roles.cache.has(general.get("semi.roleAprove"))) {
                return interaction.reply({ content: `\`❌\` Você não tem permissão para fazer isso!`, ephemeral: true });
            };

            const currentStatus = await tickets.get(`status`);
            if (currentStatus === "aprovado") {
                return interaction.reply({ content: `\`⚠️\` O pagamento já foi aprovado.`, ephemeral: true });
            };

            await tickets.set(`status`, "aprovado");
            interaction.reply({ content: `\`✅\` Pagamento aprovado com êxito.`, ephemeral: true });
            
        };

        async function pagamento(valor) {

            const tipo = await general.get("semi.tipo") || null;
            const chave = await general.get("semi.chave") || null;

            const { qrGenerator } = require('../../Lib/QRCodeLib.js')
            const qr = new qrGenerator({ imagePath: './Lib/aaaaa.png' })

            const { QrCodePix } = require('qrcode-pix')

            const valor2 = Number(valor);
            const qrCodePix = QrCodePix({
                version: '01',
                key: chave,
                name: chave,
                city: 'BRASILIA',
                cep: '28360000',
                value: valor2
            });

            const chavealeatorio = qrCodePix.payload()

            const qrcode = await qr.generate(chavealeatorio)

            const buffer = Buffer.from(qrcode.response, "base64");
            const attachment = new AttachmentBuilder(buffer, { name: "payment.png" });

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username} - Pendência Pagamento Criada`, iconURL: interaction.user.displayAvatarURL() })
                .setDescription(`-# \`✅\` Pendência para realizar pagamento criada.\n-# \`❓\` Entrega semi automática após pagamento.\n\n**Código copia e cola:**\n\`\`\`${chave} | ${tipo}\`\`\``)
                .addFields(
                    { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                    { name: `Verificação`, value: `\`📋 Semi Automática\``, inline: true }
                )
                .setColor(`#00FFFF`)
                .setFooter({ text: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
                .setTimestamp()

            embed.setImage(`attachment://payment.png`)

            await interaction.update({ content: `\`✅\` Pagamento criado com êxito.`, components: [] });

            const cargoStaff = await general.get("ticket.definicoes.cargostaff");

            interaction.channel.send({
                content: `${cargoStaff ? `<@&${cargoStaff}> - ` : ""}${interaction.user}`,
                embeds: [embed],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId(`copyChave`).setLabel(`MobileService`).setEmoji(`1218967168960434187`).setStyle(1),
                            new ButtonBuilder().setCustomId("aproveSemiAuto").setLabel(`Aprovar Pagamento`).setEmoji(`1246952363143729265`).setStyle(3)
                        )
                ],
                files: [attachment]
            }).then(async (msg) => {

                await tickets.set("pagador", interaction.user.id);

                const checkPaymentStatus = setInterval(async () => {

                    const pagaM = client.users.cache.get(await tickets.get("pagador"));

                    if (await tickets.get("status") === "aprovado") {
                        clearInterval(checkPaymentStatus);

                        if (pagaM === undefined || !pagaM) {
                            return msg.edit({ content: `\`❌\` Usuário não encontrado. Ocorreu um erro ao tentar aprovar!` });
                        };

                        await msg.edit({
                            content: `${pagaM}`,
                            embeds: [
                                new EmbedBuilder()
                                    .setAuthor({ name: `${pagaM.username} - Pagamento Realizado`, iconURL: pagaM.displayAvatarURL() })
                                    .setDescription(`-# \`✅\` Seu pagamento foi realizado com êxito.`)
                                    .addFields(
                                        { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                                        { name: `Verificação`, value: `\`📋 Semi Automática\``, inline: true }
                                    )
                                    .setColor(`#00FF00`)
                                    .setFooter({ text: `${pagaM.displayName}`, iconURL: pagaM.displayAvatarURL() })
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
                                        .setAuthor({ name: `${pagaM.username} - Pagamento Realizado`, iconURL: pagaM.displayAvatarURL() })
                                        .setDescription(`-# \`✅\` O pagamento de ${pagaM || "\`🔴 Não encontrado.\`"} foi realizado com êxito.`)
                                        .addFields(
                                            { name: `Valor`, value: `\`R$${valor}\``, inline: false },
                                            { name: `Verificação`, value: `\`📋 Semi Automática\``, inline: true },
                                            { name: `User`, value: `${pagaM || "\`🔴 Não encontrado.\`"}` }
                                        )
                                        .setColor(`#00FF00`)
                                        .setFooter({ text: `${pagaM.displayName}`, iconURL: pagaM.displayAvatarURL() })
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

                }, 2000);

            });

        };

    }
}