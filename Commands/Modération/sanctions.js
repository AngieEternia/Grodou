const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

module.exports = {
    name: 'sanctions',
    category: "Modération",
    permissions: ['ModerateMembers'],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'sanctions [@member]',
    examples: ['sanctions @utilisateur'],
    description: "J'affiche toutes les sanctions reçues par un membre du serveur...",
    options: [
        {
            name: 'target',
            description: 'Membre dont consulter les sanctions',
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember("target");
        const db = client.db;

        db.query(`SELECT * FROM bans WHERE userID = ${target.id} AND guildID = ${interaction.guild.id} ORDER BY date ASC`, async (err, bans) => {
            db.query(`SELECT * FROM kicks WHERE userID = ${target.id} AND guildID = ${interaction.guild.id} ORDER BY date ASC`, async (err, kicks) => {
                db.query(`SELECT * FROM mutes WHERE userID = ${target.id} AND guildID = ${interaction.guild.id} ORDER BY date ASC`, async (err, mutes) => {
                    db.query(`SELECT * FROM warns WHERE userID = ${target.id} AND guildID = ${interaction.guild.id} ORDER BY date ASC`, async (err, warns) => {
                        if (
                            bans.length <= 0 &&
                            kicks.length <= 0 &&
                            mutes.length <= 0 &&
                            warns.length <= 0
                        ) return interaction.reply({ content: `\`${target.displayName}\` n'a aucune sanction sur \`${interaction.guild.name}\` !`, ephemeral: true, fetchReply: true });

                        let Embed = new EmbedBuilder()
                            .setColor(client.color)
                            .setAuthor({
                                name: `Sanctions reçues par ${target.displayName}`,
                                iconURL: "https://cdn.discordapp.com/emojis/992047076584194048.png",
                            })
                            .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                            .setDescription(`Vous pouvez consulter le détail de chaque catégorie en navigant à l'aide des boutons. Appuyez sur <:ad_cancel:979738900526419999> pour fermer le menu.`)
                            .addFields({
                                name: '<:sep1:975384221138948126> Récapitulatif <:sep3:975384220849557545>',
                                value: [
                                    `> ◽️ Bannissement${bans.length > 1 ? 's' : ''} : \`${bans.length}\` <:ad_ban:979738900534820944>`,
                                    `> ◽️ Expulsion${kicks.length > 1 ? 's' : ''} : \`${kicks.length}\` <:ad_kick:979738900585148437>`,
                                    `> ◽️ Avertissement${warns.length > 1 ? 's' : ''} : \`${warns.length}\` <:ad_warn:979738900589334548>`,
                                    `> ◽️ Exclusion${mutes.length > 1 ? 's' : ''} : \`${mutes.length}\` <:ad_mute:979738900908097616>`
                                ].join("\n")
                            })
                            .setTimestamp()
                            .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                        let btn = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId("ban")
                                    .setDisabled(bans.length >= 1 ? false : true)
                                    .setEmoji("<:ad_ban:979738900534820944>")
                                    .setStyle(ButtonStyle.Primary),

                                new ButtonBuilder()
                                    .setCustomId("kick")
                                    .setDisabled(kicks.length >= 1 ? false : true)
                                    .setEmoji("<:ad_kick:979738900585148437>")
                                    .setStyle(ButtonStyle.Primary),

                                new ButtonBuilder()
                                    .setCustomId("warn")
                                    .setDisabled(warns.length >= 1 ? false : true)
                                    .setEmoji("<:ad_warn:979738900589334548>")
                                    .setStyle(ButtonStyle.Primary),

                                new ButtonBuilder()
                                    .setCustomId("mute")
                                    .setDisabled(mutes.length >= 1 ? false : true)
                                    .setEmoji("<:ad_mute:979738900908097616>")
                                    .setStyle(ButtonStyle.Primary),

                                new ButtonBuilder()
                                    .setCustomId('cancel')
                                    .setEmoji('<:ad_cancel:979738900526419999>')
                                    .setStyle(ButtonStyle.Danger),
                            )

                        let msg = await interaction.reply({ embeds: [Embed], components: [btn], fetchReply: true });
                        let filter = async () => true;
                        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 });

                        collector.on("collect", async button => {
                            if (button.user.id !== interaction.user.id) return button.reply({ content: "Bah non, tu ne peux pas faire ça, t'es pas l'auteur du message !", ephemeral: true });

                            if (button.customId === "ban") {
                                await button.deferUpdate();
                                let newEmbed = new EmbedBuilder()
                                    .setColor("#ff0000")
                                    .setTitle(`Bannissement${bans.length > 1 ? 's' : ''} de ${target.displayName}`)
                                    .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                                for (let i = 0; i < bans.length; i++) {
                                    newEmbed.addFields(
                                        {
                                            name: `<:sep1:975384221138948126>  Bannissement n°${i + 1}  <:sep3:975384220849557545>`,
                                            value: [
                                                `> ◽️ **Auteur** : ${client.users.cache.get(bans[i].authorID)}`,
                                                `> ◽️ **Durée** : \`${bans[i].time}\``,
                                                `> ◽️ **Raison** : \`${bans[i].reason}\``,
                                                `> ◽️ **Date** : <t:${Math.floor(parseInt(bans[i].date) / 1000)}:F>`
                                            ].join("\n")
                                        }
                                    )
                                }

                                await interaction.editReply({ embeds: [newEmbed] });
                            }
                            else if (button.customId === "kick") {
                                await button.deferUpdate();
                                let newEmbed = new EmbedBuilder()
                                    .setColor("#d05c5c")
                                    .setTitle(`Expulsion${bans.length > 1 ? 's' : ''} de ${target.displayName}`)
                                    .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                                for (let i = 0; i < kicks.length; i++) {
                                    newEmbed.addFields(
                                        {
                                            name: `<:sep1:975384221138948126>  Expulsion n°${i+1}  <:sep3:975384220849557545>`,
                                            value: [
                                                `> ◽️ **Auteur** : ${client.users.cache.get(kicks[i].authorID)}`,
                                                `> ◽️ **Raison** : \`${kicks[i].reason}\``,
                                                `> ◽️ **Date** : <t:${Math.floor(parseInt(kicks[i].date) / 1000)}:F>`
                                            ].join("\n")
                                        }
                                    )
                                }

                                await interaction.editReply({ embeds: [newEmbed] });
                            }
                            else if (button.customId === "mute") {
                                await button.deferUpdate();
                                let newEmbed = new EmbedBuilder()
                                    .setColor("#ffe400")
                                    .setTitle(`Exclusion${mutes.length > 1 ? 's' : ''} de ${target.displayName}`)
                                    .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                                for (let i = 0; i < mutes.length; i++) {
                                    newEmbed.addFields(
                                        {
                                            name: `<:sep1:975384221138948126>  Exclusion n°${i + 1}  <:sep3:975384220849557545>`,
                                            value: [
                                                `> ◽️ **Auteur** : ${client.users.cache.get(mutes[i].authorID)}`,
                                                `> ◽️ **Durée** : \`${mutes[i].time}\``,
                                                `> ◽️ **Raison** : \`${mutes[i].reason}\``,
                                                `> ◽️ **Date** : <t:${Math.floor(parseInt(mutes[i].date) / 1000)}:F>`
                                            ].join("\n")
                                        }
                                    )
                                }

                                await interaction.editReply({ embeds: [newEmbed] });
                            }
                            else if (button.customId === "warn") {
                                await button.deferUpdate();
                                let newEmbed = new EmbedBuilder()
                                    .setColor("#ff8a00")
                                    .setTitle(`Avertissement${warns.length > 1 ? 's' : ''} de ${target.displayName}`)
                                    .setThumbnail(target.displayAvatarURL({ dynamic: true }))
                                    .setTimestamp()
                                    .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                                for (let i = 0; i < warns.length; i++) {
                                    newEmbed.addFields(
                                        {
                                            name: `<:sep1:975384221138948126>  Avertissement n°${i + 1}  <:sep3:975384220849557545>`,
                                            value: [
                                                `> ◽️ **Auteur** : ${client.users.cache.get(warns[i].authorID)}`,
                                                `> ◽️ **Raison** : \`${warns[i].reason}\``,
                                                `> ◽️ **Date** : <t:${Math.floor(parseInt(warns[i].date) / 1000)}:F>`
                                            ].join("\n")
                                        }
                                    )
                                }

                                await interaction.editReply({ embeds: [newEmbed] });
                            }
                            else return await collector.stop();
                        });

                        collector.on("end", async () => {
                            return await interaction.editReply({ embeds: [Embed], components: [] })
                        })
                    });
                });
            });
        });

    }
}