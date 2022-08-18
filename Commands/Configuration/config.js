const { EmbedBuilder, PermissionFlagsBits } = require("discord.js")

module.exports = {
    name: 'config',
    category: "Configuration",
    permissions: ['ManageGuild'],
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    ownerOnly: false,
    usage: 'config',
    examples: ['config'],
    description: "Configure-moi sur ton serveur !",

    async runInteraction(client, interaction) {
        const db = client.db;

        let iconLogsMember = "<:g_off:1005559943031705661>", iconLogsModo = "<:g_off:1005559943031705661>", iconLogsOther = "<:g_off:1005559943031705661>", iconAntiRaid, iconWelcomes = "<:g_off:1005559943031705661>", iconVoices = "<:g_off:1005559943031705661>", iconTrolls;
        let channelLogsMember, channelLogsModo, channelLogsOther, channelWelcomes, channelVoices, channelTrolls;

        db.query(`SELECT * FROM logs WHERE guildID = ${interaction.guild.id} AND type = 'members'`, async (err, logsMember) => { // logs des membres
            db.query(`SELECT * FROM logs WHERE guildID = ${interaction.guild.id} AND type = 'modo'`, async (err, logsModo) => { // logs modération
                db.query(`SELECT * FROM logs WHERE guildID = ${interaction.guild.id} AND type = 'other'`, async (err, logsOther) => { // logs autres
                    db.query(`SELECT * FROM setup WHERE guildID = ${interaction.guild.id} AND type = 'welcome'`, async (err, welc) => {
                        db.query(`SELECT * FROM setup WHERE guildID = ${interaction.guild.id} AND type = 'troll'`, async (err, troll) => {
                            db.query(`SELECT * FROM setup WHERE guildID = ${interaction.guild.id} AND type = 'voice'`, async (err, voice) => {
                                db.query(`SELECT * FROM serveur WHERE guildID = ${interaction.guild.id}`, async (err, raid) => {
                                    ///// ANTIRAID ET TROLLS /////
                                    // Icones on/off + salons s'ils existent
                                    if (logsMember.length < 1) return interaction.reply({ content: "Le serveur n'est pas enregistré dans la base de données : veuillez envoyer au moins un message pour y remédier !", ephemeral: true });
                                    else {
                                        if (raid[0].raid === "on") iconAntiRaid = "<:g_on:1005559944323530802>";
                                        else iconAntiRaid = "<:g_off:1005559943031705661>";

                                        if (raid[0].troll === "on") iconTrolls = "<:g_on:1005559944323530802>";
                                        else iconTrolls = "<:g_off:1005559943031705661>";
                                    };

                                    ///// LOGS /////
                                    // Icones on/off + salons s'ils existent
                                    if (logsMember.length < 1) channelLogsMember = "";
                                    else {
                                        iconLogsMember = "<:g_on:1005559944323530802>";
                                        for (let i = 0; i < logsMember.length; i++) {
                                            channelLogsMember = ` ➔ <#${logsMember[i].channelID}>`;
                                        }
                                    };

                                    if (logsModo.length < 1) channelLogsModo = "";
                                    else {
                                        iconLogsModo = "<:g_on:1005559944323530802>";
                                        for (let i = 0; i < logsModo.length; i++) {
                                            channelLogsModo = ` ➔ <#${logsModo[i].channelID}>`;
                                        }
                                    };

                                    if (logsOther.length < 1) channelLogsOther = "";
                                    else {
                                        iconLogsOther = "<:g_on:1005559944323530802>";
                                        for (let i = 0; i < logsOther.length; i++) {
                                            channelLogsOther = ` ➔ <#${logsOther[i].channelID}>`;
                                        }
                                    };

                                    ///// AUTRES /////
                                    // Icones on/off + salons s'ils existent
                                    if (welc.length < 1) channelWelcomes = "";
                                    else {
                                        iconWelcomes = "<:g_on:1005559944323530802>";
                                        for (let i = 0; i < welc.length; i++) {
                                            channelWelcomes = ` ➔ <#${welc[i].channelID}>`;
                                        }
                                    };

                                    if (voice.length < 1) channelVoices = "";
                                    else {
                                        iconVoices = "<:g_on:1005559944323530802>";
                                        channelVoices = " ➔";
                                        for (let i = 0; i < voice.length; i++) {
                                            channelVoices += ` <#${voice[i].channelID}>`;
                                        }
                                    };

                                    if (troll.length < 1) channelTrolls = "";
                                    else {
                                        iconTrolls = "<:g_on:1005559944323530802>";
                                        channelTrolls = " ➔";
                                        for (let i = 0; i < troll.length; i++) {
                                            channelTrolls += ` <#${troll[i].channelID}>`;
                                        }
                                    };

                                    // Embed final
                                    let embed = new EmbedBuilder()
                                        .setColor(client.color)
                                        .setAuthor({ name: `Configuration de ${client.user.username}`, iconURL: 'https://cdn.discordapp.com/emojis/897582796434985031.png' })
                                        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                                        .setDescription(
                                            [
                                                `Bienvenue sur ma commande de **configuration**!`,
                                                `Je te dévoile ici les commandes qui t'aideront à correctement me paramétrer sur ton serveur.`,
                                                `N'hésitez pas à consulter leurs détails avec \`/help\`.\n\nSois prudent... <:grodou3:903378318362017803>`
                                            ].join('\n\n')
                                        )
                                        .addFields(
                                            // {
                                            //     name: `<:sep1:975384221138948126> Commandes disponibles <:sep3:975384220849557545>`,
                                            //     value: [
                                            //         `> ◽️ **/setlogs** (membres, modération, autres)`,
                                            //         `> ◽️ **/setwelcome**`,
                                            //         `> ◽️ **/setvoice**`,
                                            //         `> ◽️ **/setevent**`,
                                            //         `> ◽️ **/antiraid**`,
                                            //     ].join("\n")
                                            // },
                                            {
                                                name: '<:sep1:975384221138948126> Protection du serveur <:sep3:975384220849557545>',
                                                value: [
                                                    `> ◽️ Anti-raid : ${iconAntiRaid} `
                                                ].join("\n")
                                            },
                                            {
                                                name: '<:sep1:975384221138948126> Affichage des logs <:sep3:975384220849557545>',
                                                value: [
                                                    `> ◽️ Membres : ${iconLogsMember + channelLogsMember} `,
                                                    `> ◽️ Modération : ${iconLogsModo + channelLogsModo}`,
                                                    `> ◽️ Autres : ${iconLogsOther + channelLogsOther}`
                                                ].join("\n")
                                            },
                                            {
                                                name: '<:sep1:975384221138948126> Autres informations <:sep3:975384220849557545>',
                                                value: [
                                                    `> ◽️ Arrivées et départs : ${iconWelcomes + channelWelcomes} `,
                                                    `> ◽️ Canaux vocaux : ${iconVoices + channelVoices}`,
                                                    `> ◽️ Trolls de ${client.user.username} : ${iconTrolls + channelTrolls}`
                                                ].join("\n")
                                            }
                                        )
                                        .setTimestamp()
                                        .setFooter({ text: client.embedFooter, iconURL: client.embedFootIcon });

                                    await interaction.reply({ embeds: [embed] })
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}