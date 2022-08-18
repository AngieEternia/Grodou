const { PermissionFlagsBits, AttachmentBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'balance',
    category: "Économie",
    permissions: ['SendMessages'],
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
    ownerOnly: false,
    usage: 'balance',
    examples: ['balance'],
    description: "Je fais le point sur tes comptes à la Banque Persian et t'aide à gérer ta fortune !",
    async runInteraction(client, interaction) {
        const db = client.db;
        const user = interaction.user;
        const regexpnumber = new RegExp(/^[0-9]*$/gm);

        // Quelques embeds
        ////// Embed de réussite
        let thumbnail = new AttachmentBuilder(`./Img/emotes/persian3.png`, { name: `persian.png` });
        let thumbnailWaiting = new AttachmentBuilder(`./Img/emotes/persian3.png`, { name: `persian.png` });

        let SuccessEmbed = new EmbedBuilder()
            .setColor("#40a861")
            .setThumbnail(`attachment://${thumbnail.name}`)
        ////// Embed d'erreur
        let WarningEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setAuthor({ name: `${"Erreur à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/979484974443028480.png" })
            .setThumbnail(`attachment://${thumbnail.name}`)
        ////// Embed de dépôt/retrait
        let EmbedWaiting = new EmbedBuilder()
            .setColor("#40a861")
            .setThumbnail(`attachment://${thumbnailWaiting.name}`)


        db.query(`SELECT * FROM bank WHERE userID = ${user.id} AND guildID = ${interaction.guild.id}`, async (err, req) => {
            if (req < 1) {
                thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                WarningEmbed.setDescription(
                    [
                        `Hey ${user}, je ne peux pas faire le point sur ta fortune !`,
                        `**Tu n'as pas ouvert de compte chez la Banque Persian !**`,
                        `Tu peux en ouvrir un en utilisant la commande \`/daily\` !`
                    ].join("\n")
                )

                return interaction.reply({ embeds: [WarningEmbed], files: [thumbnail], fetchReply: true });
            }
            else {
                thumbnail = new AttachmentBuilder(`./Img/emotes/persian0.png`, { name: `persian.png` });
                SuccessEmbed.setAuthor({ name: `${"Bienvenue à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/996867247245103265.png" })

                if (req[0].dette === 0) {
                    SuccessEmbed.addFields(
                        {
                            name: `Bonjour ${user.username} ! Bienvenue à la Banque Persian.`,
                            value: `Ta fortune s'élève actuellement à **${(req[0].money + req[0].bank).toLocaleString('fr-FR')}** <:piece:997504745730211941>.`,
                            inline: false
                        },
                        {
                            name: `<:pokepiece:996867245714182235> Sur vous`,
                            value: `${(req[0].money).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                            inline: true
                        },
                        {
                            name: `<:pokebank:996867247245103265> En banque`,
                            value: `${(req[0].bank).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                            inline: true
                        }
                    )
                } else {
                    SuccessEmbed.addFields(
                        {
                            name: `Bonjour ${user.username} ! Bienvenue à la Banque Persian.`,
                            value: `Ta fortune s'élève actuellement à **${(req[0].money + req[0].bank).toLocaleString('fr-FR')}** <:piece:997504745730211941>.`,
                            inline: false
                        },
                        {
                            name: `<:pokepiece:996867245714182235> Sur vous`,
                            value: `${(req[0].money).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                            inline: true
                        },
                        {
                            name: `<:pokebank:996867247245103265> En banque`,
                            value: `${(req[0].bank).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                            inline: true
                        },
                        {
                            name: `<:dette:998498370282848287> Dette`,
                            value: `${(req[0].dette).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                            inline: true
                        },
                        {
                            name: `Attention, tu as une dette !`,
                            value: `Comme tu as une dette, tu ne peux pas percevoir d'intérêt chaque jour...`,
                            inline: false
                        }
                    )
                }

                // On crée les boutons
                let btn;
                if (req[0].dette === 0) {
                    // S'il n'y a pas de dette, les trois boutons sont disponibles
                    btn = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('deposer')
                                .setEmoji('<:add_bank:997507696175616040>')
                                .setLabel("Déposer")
                                .setDisabled(false)
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId('retirer')
                                .setEmoji('<:remove_bank:997507698952261730>')
                                .setLabel("Retirer")
                                .setDisabled(false)
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId('annuler')
                                .setEmoji('<:ad_cancel:979738900526419999>')
                                .setLabel("Annuler")
                                .setStyle(ButtonStyle.Danger),
                        );
                } else {
                    // Comme il y a une dette, on ne peut que déposer ou annuler
                    btn = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('deposer')
                                .setEmoji('<:add_bank:997507696175616040>')
                                .setLabel("Déposer")
                                .setDisabled(false)
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId('retirer')
                                .setEmoji('<:remove_bank:997507698952261730>')
                                .setLabel("Retirer")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),

                            new ButtonBuilder()
                                .setCustomId('annuler')
                                .setEmoji('<:ad_cancel:979738900526419999>')
                                .setLabel("Annuler")
                                .setStyle(ButtonStyle.Danger),
                        );
                }
                await interaction.reply({ embeds: [SuccessEmbed], files: [thumbnail], components: [btn], fetchReply: true });
                let filter = async () => true;
                let timeError = 15000, timeErrorTxt = ms(15000, { long: true })
                let mapObj = { second: "seconde", minute: "minute", hour: "heure", day: "jour" }; // mini dico pour traduire ms()
                timeErrorTxt = timeErrorTxt.replace(/second|minute|hour|day/gi, function (matched) { return mapObj[matched]; }); // on traduit...

                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

                collector.on("collect", async button => {
                    if (button.user.id !== interaction.user.id) return button.reply({ content: "Bah non, tu ne peux pas faire ça, t'es pas l'auteur du message !", ephemeral: true });

                    const btn2 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('deposer')
                                .setEmoji('<:add_bank:997507696175616040>')
                                .setLabel("Déposer")
                                .setDisabled(true)
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId('retirer')
                                .setEmoji('<:remove_bank:997507698952261730>')
                                .setLabel("Retirer")
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(true),

                            new ButtonBuilder()
                                .setCustomId('annuler2')
                                .setEmoji('<:ad_cancel:979738900526419999>')
                                .setLabel("Annuler")
                                .setStyle(ButtonStyle.Danger),
                        );
                    // On veut déposer une somme d'argent à la banque
                    if (button.customId === "deposer") {
                        if (button.customId === "cancel2") { return await collector.stop() };

                        thumbnailWaiting = new AttachmentBuilder(`./Img/emotes/persian0.png`, { name: `persian.png` });
                        EmbedWaiting.setAuthor({ name: `${"Faire un dépôt à la Banque Persian".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507696175616040.png" })
                        EmbedWaiting.setDescription(
                            [
                                `**Quelle somme souhaites-tu déposer ?**\n`,
                                `Merci d'indiquer une somme en chiffres !`,
                                `*Tu as ${timeErrorTxt} pour répondre.*`
                            ].join("\n")
                        )
                        await interaction.editReply({ embeds: [EmbedWaiting], files: [thumbnailWaiting], components: [btn2], fetchReply: true });
                        button.deferUpdate();

                        let filterCollect = m => m.author.id === button.user.id;
                        interaction.channel
                            .awaitMessages({ filter: filterCollect, max: 1, time: timeError, errors: ['time'] })
                            .then(async collected => {
                                let number = parseInt((collected.first()).content);

                                if (regexpnumber.test(collected.first()) === false) {
                                    thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                                    WarningEmbed.addFields({
                                        name: `« \`${collected.first()}\` » n'est pas un nombre !`,
                                        value: "Je suis désolé mais je ne comprends pas ce que tu as voulu dire ! Je ne peux rien faire avec cette information !"
                                    });
                                    await interaction.editReply({ embeds: [WarningEmbed], files: [thumbnail], components: [] });
                                    return collected.first().delete(), collector.stop();
                                }
                                // Si le dépot est plus grand que ce que l'on a sur soi
                                if (number > req[0].money) {
                                    thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                                    WarningEmbed.setDescription(
                                        [
                                            `**Tu n'as que ${(req[0].money).toLocaleString('fr-FR')} <:piece:997504745730211941> sur toi !`,
                                            `Comment tu vas faire pour déposer ${number.toLocaleString('fr-FR')} <:piece:997504745730211941> ?!`,
                                            `Il te manque ${(number - req[0].money).toLocaleString('fr-FR')} <:piece:997504745730211941> !**`
                                        ].join('\n\n')
                                    )
                                    await interaction.editReply({ embeds: [WarningEmbed], files: [thumbnail], components: [] });
                                    return collected.first().delete(), collector.stop();
                                }
                                // Si c'est bon...
                                else {
                                    // S'il y a une dette à rembourser
                                    if (req[0].dette > 0) {
                                        // Si le dépot est plus petit ou égal à la dette
                                        if (number <= req[0].dette) {
                                            db.query(`UPDATE bank SET money = '${parseInt(req[0].money) - number}', dette = '${parseInt(req[0].dette) - number}' WHERE userID = ${interaction.user.id} AND guildID = ${interaction.guild.id}`);

                                            thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                                            SuccessEmbed.setFields([]);
                                            SuccessEmbed.setAuthor({ name: `${"Dépôt effectué avec succès !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507696175616040.png" });
                                            SuccessEmbed.setDescription(`**${number.toLocaleString('fr-FR')} <:piece:997504745730211941>, très bien. Ce dépôt a remboursé ${parseInt(req[0].dette - number) == 0 ? "la totalité de " : "une partie de "}ta dette !**\nㅤ`);
                                            SuccessEmbed.addFields(
                                                {
                                                    name: `<:pokepiece:996867245714182235> Sur vous`,
                                                    value: `${(req[0].money - number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                    inline: true
                                                },
                                                {
                                                    name: `<:pokebank:996867247245103265> En banque`,
                                                    value: `${(req[0].bank).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                    inline: true
                                                },
                                                {
                                                    name: `<:dette:998498370282848287> Dette`,
                                                    value: `${(req[0].dette - number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                    inline: true
                                                }
                                            );
                                            await interaction.editReply({ embeds: [SuccessEmbed], files: [thumbnail], components: [] });
                                            return collected.first().delete(), collector.stop();
                                        }
                                        // Si le dépot est plus grand que la dette
                                        else {
                                            db.query(`UPDATE bank SET money = '${parseInt(req[0].money) - number}', dette = '0', bank = '${parseInt(req[0].bank) + (number - parseInt(req[0].dette))}' WHERE userID = ${interaction.user.id} AND guildID = ${interaction.guild.id}`);

                                            thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                                            SuccessEmbed.setAuthor({ name: `${"Dépôt effectué avec succès !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507696175616040.png" });
                                            SuccessEmbed.setFields([]);
                                            SuccessEmbed.setDescription(`**${number.toLocaleString('fr-FR')} <:piece:997504745730211941>, très bien. Ce dépôt a remboursé ta dette et le surplus a été déposé sur ton compte en banque !**\nㅤ`)
                                            SuccessEmbed.addFields(
                                                {
                                                    name: `<:pokepiece:996867245714182235> Sur vous`,
                                                    value: `${(req[0].money - number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                    inline: true
                                                },
                                                {
                                                    name: `<:pokebank:996867247245103265> En banque`,
                                                    value: `${(req[0].bank + (number - req[0].dette)).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                    inline: true
                                                },
                                                {
                                                    name: `<:dette:998498370282848287> Dette`,
                                                    value: `0 <:piece:997504745730211941>`,
                                                    inline: true
                                                }
                                            );
                                            await interaction.editReply({ embeds: [SuccessEmbed], files: [thumbnail], components: [] });
                                            return collected.first().delete(), collector.stop();
                                        }
                                    }
                                    // S'il n'y a pas de dette
                                    else {
                                        db.query(`UPDATE bank SET money = '${parseInt(req[0].money) - number}', bank = '${parseInt(req[0].bank) + number}'  WHERE userID = ${interaction.user.id} AND guildID = ${interaction.guild.id}`);

                                        thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                                        SuccessEmbed.setAuthor({ name: `${"Dépôt effectué avec succès !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507696175616040.png" });
                                        SuccessEmbed.setFields([]);
                                        SuccessEmbed.setDescription(`**${number.toLocaleString('fr-FR')} <:piece:997504745730211941>, très bien. Fais-moi confiance, ton argent <:piece:997504745730211941> est en sécurité avec moi !**\nㅤ`);
                                        SuccessEmbed.addFields(
                                            {
                                                name: `<:pokepiece:996867245714182235> Sur vous`,
                                                value: `${(req[0].money - number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                inline: true
                                            },
                                            {
                                                name: `<:pokebank:996867247245103265> En banque`,
                                                value: `${(req[0].bank + number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                                inline: true
                                            }
                                        );

                                        await interaction.editReply({ embeds: [SuccessEmbed], files: [thumbnail], components: [] });
                                        return collected.first().delete(), collector.stop();
                                    }
                                }
                            })
                            // S'il y a une erreur
                            .catch(async collected => {
                                thumbnail = new AttachmentBuilder(`./Img/emotes/persian3.png`, { name: `persian.png` });
                                WarningEmbed.setDescription(`**Oups, ${user.username}, tu as mis tellement de temps à répondre que je me suis endormi... Il faut recommencer depuis le début !\n\nN'oublie pas que tu n'as que \`${timeErrorTxt}\` pour répondre !**`);

                                await interaction.editReply({ embeds: [WarningEmbed], files: [thumbnail], components: [] })
                                return collector.stop();
                            });
                    }
                    // On veut retirer  une somme d'argent à la banque
                    else if (button.customId === "retirer") {
                        if (button.customId === "cancel2") { return await collector.stop() }
                        // Embed pour le dépot
                        thumbnailWaiting = new AttachmentBuilder(`./Img/emotes/persian0.png`, { name: `persian.png` });
                        EmbedWaiting.setAuthor({ name: `${"Faire un retrait à la Banque Persian".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507698952261730.png" })
                        EmbedWaiting.setDescription(`**Quelle somme souhaites-tu retirer ?**\n\n*Merci d'indiquer une somme en chiffres !\nTu as ${timeErrorTxt} pour répondre.*`)

                        await interaction.editReply({ embeds: [EmbedWaiting], files: [thumbnailWaiting], components: [btn2], fetchReply: true });
                        button.deferUpdate();

                        let filterCollect = m => m.author.id === button.user.id;
                        interaction.channel
                            .awaitMessages({ filter: filterCollect, max: 1, time: timeError, errors: ['time'] })
                            .then(async collected => {
                                let number = parseInt((collected.first()).content);
                                if (regexpnumber.test(collected.first()) === false) {
                                    thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                                    WarningEmbed.addFields({
                                        name: `« \`${collected.first()}\` » n'est pas un nombre !`,
                                        value: "Je suis désolé mais je ne comprends pas ce que tu as voulu dire ! Je ne peux rien faire avec cette information !"
                                    });
                                    await interaction.editReply({ embeds: [WarningEmbed], files: [thumbnail], components: [] });
                                    return collected.first().delete(), collector.stop();
                                }
                                // Si dépot est plus grand qu'en banque
                                if (number > req[0].bank) {
                                    thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                                    WarningEmbed.setDescription(
                                        [
                                            `**Tu n'as que ${(req[0].bank).toLocaleString('fr-FR')} <:piece:997504745730211941> en banque !`,
                                            `Comment tu vas faire pour retirer ${number.toLocaleString('fr-FR')} <:piece:997504745730211941> ?!`,
                                            `Il te manque ${(number - req[0].bank).toLocaleString('fr-FR')} <:piece:997504745730211941> !**`
                                        ].join('\n\n')
                                    );
                                    await interaction.editReply({ embeds: [WarningEmbed], files: [thumbnail], components: [] });
                                    return collected.first().delete(), collector.stop();
                                }
                                // Si c'ets bon
                                else {
                                    db.query(`UPDATE bank SET money = '${parseInt(req[0].money) + number}', bank = '${parseInt(req[0].bank) - number}'  WHERE userID = ${user.id} AND guildID = ${interaction.guild.id}`);

                                    thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                                    SuccessEmbed.setDescription(`Voici ton argent <:piece:997504745730211941> :\n**${number.toLocaleString('fr-FR')} <:piece:997504745730211941>, tout rond !**\nㅤ`);
                                    SuccessEmbed.setFields([])
                                    SuccessEmbed.setAuthor({ name: `${"Retrait effectué avec succès !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507698952261730.png" });
                                    SuccessEmbed.addFields(
                                        {
                                            name: `<:pokepiece:996867245714182235> Sur vous`,
                                            value: `${(req[0].money + number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                            inline: true
                                        },
                                        {
                                            name: `<:pokebank:996867247245103265> En banque`,
                                            value: `${(req[0].bank - number).toLocaleString('fr-FR')} <:piece:997504745730211941>`,
                                            inline: true
                                        }
                                    );

                                    await interaction.editReply({ embeds: [SuccessEmbed], files: [thumbnail], components: [] });
                                    return await collected.first().delete(), collector.stop();
                                }
                            })
                            // S'il y a une erreur
                            .catch(async collected => {
                                thumbnail = new AttachmentBuilder(`./Img/emotes/persian3.png`, { name: `persian.png` });
                                WarningEmbed.setDescription(`**Oups, ${user.username}, tu as mis tellement de temps à répondre que je me suis endormi... Il faut recommencer depuis le début !\n\nN'oublie pas que tu n'as que \`${timeErrorTxt}\` pour répondre !**`);

                                await interaction.editReply({ embeds: [WarningEmbed], files: [thumbnail], components: [] })
                                return collector.stop();
                            });
                    }
                    else return collector.stop();
                })
                collector.on("end", async () => {
                    await interaction.editReply({ components: [] });
                })
            }
        });
    }
}