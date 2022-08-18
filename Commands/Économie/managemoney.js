const { ApplicationCommandOptionType, PermissionFlagsBits, AttachmentBuilder, EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'money',
    category: "Économie",
    permissions: ['ModerateMembers'],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'money [add|remove] [@member] [number]',
    examples: ['money add @utilisateur 500', 'money add @utilisateur 2000'],
    description: "Je te permets de donner ou de reitrer de l'argent d'un utilisateur !",
    options: [
        {
            name: 'add',
            description: 'Donner des Poképièces à un utilisateur',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'utilisateur',
                    description: 'Le membre à qui donner des Poképièces',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'nombre',
                    description: 'Le nombre de Poképièces à ajouter',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                    minValue: 0
                }
            ]
        },
        {
            name: 'remove',
            description: 'Retirer des Poképièces à un utilisateur',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'utilisateur',
                    description: 'Le membre à qui retirer des Poképièces',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'nombre',
                    description: 'Le nombre de Poképièces à retirer',
                    type: ApplicationCommandOptionType.Number,
                    required: true,
                    minValue: 0
                }
            ]
        }
    ],
    async runInteraction(client, interaction) {
        const target = interaction.options.getMember('utilisateur');
        const amount = interaction.options.getNumber('nombre');
        const db = client.db;

        db.query(`SELECT * FROM bank WHERE userID = ${target.id} AND guildID = ${interaction.guild.id}`, async (err, req) => {
            // AJOUTER DE L'ARGENT
            if (interaction.options.getSubcommand() === 'add') {
                // Si l'utilisateur n'est pas enregistré dans la DB :
                if (req.length < 1) {
                    let sql = `INSERT INTO bank (guildID, userID, money, bank, dette, daily) VALUES ('${interaction.guild.id}', '${target.id}', '0', '${amount}', '0', '')`;
                    db.query(sql, async function (err) {
                        if (err) throw err;
                        const thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                        let SuccessEmbed = new EmbedBuilder()
                            .setColor("#40a861")
                            .setAuthor({ name: `${"De l'argent a été déposé sur un compte !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507696175616040.png" })
                            .setThumbnail(`attachment://${thumbnail.name}`)
                            .addFields(
                                {
                                    name: `Bonjour, bonjour ! Bienvenue à la Banque Persian **${target.displayName}** !`,
                                    value: [
                                        `Il semblerait qu'une âme généreuse ait décidé de te verser **${amount.toLocaleString('fr-FR')}** <:piece:997504745730211941> sur ton compte en banque !`,
                                        `Comme tu n'en avais pas, je l'ai ouvert pour toi ! *Nyaaaaaa~*`
                                    ].join("\n")
                                }
                            )
                        await interaction.reply({ content: `<@${target.id}>`, embeds: [SuccessEmbed], files: [thumbnail] });
                    })
                }
                // Sinon...
                else {
                    db.query(`UPDATE bank SET bank = '${req[0].bank + amount}' WHERE userID = ${target.id} AND guildID = ${interaction.guild.id}`);
                    const thumbnail = new AttachmentBuilder(`./Img/emotes/persian1.png`, { name: `persian.png` });
                    let SuccessEmbed = new EmbedBuilder()
                        .setColor("#40a861")
                        .setAuthor({ name: `${"De l'argent a été déposé sur ton compte !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507696175616040.png" })
                        .setThumbnail(`attachment://${thumbnail.name}`)
                        .addFields(
                            {
                                name: `Bonjour, bonjour ! Bienvenue à la Banque Persian **${target.displayName}** !`,
                                value: [
                                    `Il semblerait qu'une âme généreuse ait décidé de te verser **${amount.toLocaleString('fr-FR')}** <:piece:997504745730211941> sur ton compte en banque !`,
                                    `Tu disposes désormais de ${(req[0].bank + amount).toLocaleString('fr-FR')} <:piece:997504745730211941> ! *Nyaaaaaa~*`
                                ].join("\n")
                            }
                        )
                    await interaction.reply({ content: `<@${target.id}>`, embeds: [SuccessEmbed], files: [thumbnail] });
                }
            }
            // RETIRER DE L'ARGENT
            else if (interaction.options.getSubcommand() === 'remove') {
                // Si l'utilisateur n'est pas enregistré dans la DB :
                if (req.length < 1) {
                    let sql = `INSERT INTO bank (guildID, userID, money, bank, dette, daily) VALUES ('${interaction.guild.id}', '${target.id}', '0', '0', '0', '')`;
                    db.query(sql, async function (err) {
                        if (err) throw err;
                        const thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                        let WarningEmbed = new EmbedBuilder()
                            .setColor("#ff0000")
                            .setAuthor({ name: `${"Erreur à la Banque Persian !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/979484974443028480.png" })
                            .setThumbnail(`attachment://${thumbnail.name}`)
                            .setDescription(
                                [
                                    `**Tu n'as pas de compte ouvert à la Banque Persian, et ce n'est peut-être pas plus mal !`,
                                    `Je ne sais pas ce que tu as fait, mais on voulait retirer de l'argent sur ton compte...**`
                                ].join("\n\n")
                            )
                        await interaction.reply({ content: `<@${target.id}>`, embeds: [WarningEmbed], files: [thumbnail] });
                    })
                }
                // Sinon...
                else {
                    if (amount <= req[0].bank) {
                        db.query(`UPDATE bank SET bank = '${req[0].bank - amount}' WHERE userID = ${target.id} AND guildID = ${interaction.guild.id}`);
                        const thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                        let WarningEmbed = new EmbedBuilder()
                            .setColor("#ff0000")
                            .setAuthor({ name: `${"De l'argent a été retiré sur ton compte !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507698952261730.png" })
                            .setThumbnail(`attachment://${thumbnail.name}`)
                            .addFields(
                                {
                                    name: `Houlà ! Qu'as-tu donc fait **${target.displayName}** !?`,
                                    value: `Je viens d'avoir une note comme quoi **${amount.toLocaleString('fr-FR')}** <:piece:997504745730211941> avai${amount > 1 ? "ent été retirées" : "t été retirée"} de ton compte en banque ! Fais attention...`
                                }
                            )
                        await interaction.reply({ content: `<@${target.id}>`, embeds: [WarningEmbed], files: [thumbnail] });
                    }
                    else {
                        let totalMoney = req[0].bank + req[0].money; // total argent : soi + banque
                        let resteRetire = req[0].bank - amount; // ce qu'il reste à retirer après avoir prélevé sur la banque
                        let resteMoney = req[0].money + resteRetire; // ce qu'il reste sur toi après le reste du prélèvement
                        let dette = amount - totalMoney; // la dette si elle existe

                        console.log("totalMoney :"+totalMoney)
                        console.log("resteRetire :"+resteRetire)
                        console.log("resteMoney :"+resteMoney)
                        console.log("dette :"+dette)

                        if (amount <= totalMoney) {
                            db.query(`UPDATE bank SET bank = '0', money = '${resteMoney}' WHERE userID = ${target.id} AND guildID = ${interaction.guild.id}`)

                            const thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                            let WarningEmbed = new EmbedBuilder()
                                .setColor("#ff0000")
                                .setAuthor({ name: `${"De l'argent a été retiré sur ton compte !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507698952261730.png" })
                                .setThumbnail(`attachment://${thumbnail.name}`)
                                .addFields(
                                    {
                                        name: `Houlà ! Qu'as-tu donc fait **${target.displayName}** !?`,
                                        value: [
                                            `Je viens d'avoir une note comme quoi **${amount.toLocaleString('fr-FR')}** <:piece:997504745730211941> devai${amount > 1 ? "ent être retirées" : "t être retirée"} de ton compte !`,
                                            `Comme tu n'as pas assez sur ton compte en banque, **${Math.abs(resteRetire).toLocaleString('fr-FR')}** <:piece:997504745730211941> ${Math.abs(resteRetire) > 1 ? "ont été prises" : "a été prise"} dans tes poches...`
                                        ].join("\n")
                                    }
                                )

                            await interaction.reply({ content: `<@${target.id}>`, embeds: [WarningEmbed], files: [thumbnail] });

                        } else {
                            db.query(`UPDATE bank SET bank = '0', money = '0', dette = '${req[0].dette + dette}' WHERE userID = ${target.id} AND guildID = ${interaction.guild.id}`)

                            const thumbnail = new AttachmentBuilder(`./Img/emotes/persian2.png`, { name: `persian.png` });
                            let WarningEmbed = new EmbedBuilder()
                                .setColor("#ff0000")
                                .setAuthor({ name: `${"De l'argent a été retiré sur ton compte !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/997507698952261730.png" })
                                .setThumbnail(`attachment://${thumbnail.name}`)

                            if (req[0].dette == 0) {
                                WarningEmbed.addFields(
                                    {
                                        name: `Houlà ! Qu'as-tu donc fait **${target.displayName}** !?`,
                                        value: `Je viens d'avoir une note comme quoi **${amount.toLocaleString('fr-FR')}** <:piece:997504745730211941> devai${amount > 1 ? "ent être retirées" : "t être retirée"} de ton compte ! Comme tu n'as pas ni assez sur ton compte en banque, ni sur toi, te voilà avec une dette de **${dette.toLocaleString('fr-FR')}** <:piece:997504745730211941> !`
                                    }
                                )

                            } else {
                                WarningEmbed.addFields(
                                    {
                                        name: `Houlà ! Qu'as-tu donc fait **${target.displayName}** !?`,
                                        value: `Je viens d'avoir une note comme quoi **${amount.toLocaleString('fr-FR')}** <:piece:997504745730211941> devai${amount > 1 ? "ent être retirées" : "t être retirée"} de ton compte ! Comme tu as déjà une dette de **${req[0].dette} <:piece:997504745730211941>**, la voilà augmentée de **${dette.toLocaleString('fr-FR')}** <:piece:997504745730211941> supplémentaire${dette > 1 ? "s" : ""} !`
                                    }
                                )
                            }
                            await interaction.reply({ content: `<@${target.id}>`, embeds: [WarningEmbed], files: [thumbnail] });
                        }
                    }
                }
            }
        });
    }
}