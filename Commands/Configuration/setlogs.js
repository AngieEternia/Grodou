const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    name: 'setlogs',
    category: "Configuration",
    permissions: ['MANAGE_GUILD'],
    ownerOnly: false,
    usage: 'setlogs [members|moderation|other] [add|remove]',
    examples: ['setlogs join', 'setlogs leave'],
    description: "Je te montre comment gérer les threads !",
    options: [
        {
            name: 'membres',
            description: 'Salon où sont conservés les logs des arrivées et départs',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'choix',
                    description: `Ajouter ou Supprimer un salon`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Ajouter',
                            value: 'add'
                        },
                        {
                            name: 'Supprimer',
                            value: 'remove'
                        },
                    ]
                },
                {
                    name: 'salon',
                    description: 'Le salon pour afficher les logs des arrivées et départs',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: 0,
                    required: false
                }
            ]
        },
        {
            name: 'modération',
            description: 'Salon où sont conservés les logs des actes de modération',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'choix',
                    description: `Ajouter ou Supprimer un salon`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Ajouter',
                            value: 'add'
                        },
                        {
                            name: 'Supprimer',
                            value: 'remove'
                        },
                    ]
                },
                {
                    name: 'salon',
                    description: 'Le salon pour afficher les logs des actes de modération',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: 0,
                    required: false
                }
            ]
        },
        {
            name: 'autres',
            description: 'Salon où sont conservés les autres types de logs',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'choix',
                    description: `Ajouter ou Supprimer un salon`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Ajouter',
                            value: 'add'
                        },
                        {
                            name: 'Supprimer',
                            value: 'remove'
                        },
                    ]
                },
                {
                    name: 'salon',
                    description: 'Le salon pour afficher les autres types de logs',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: 0,
                    required: false
                }
            ]
        }
    ],
    async runInteraction(client, interaction) {
        const db = client.db;

        // On crée l'embed d'erreur
        let errorEmbed = new EmbedBuilder()
            .setColor("#ff0000")
            .setAuthor({ name: `${'Une erreur s\'est produite !'.toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/979484974443028480.png" });

        // On crée l'embed de réussite
        let thumbnailSucess = new AttachmentBuilder(`./Img/emotes/grodou1.png`, { name: `grodou.png` });
        let sucessEmbed = new EmbedBuilder()
            .setColor("#40a861")
            .setAuthor({ name: `${"Opération menée avec succès !".toUpperCase()}`, iconURL: "https://cdn.discordapp.com/emojis/982699120378642483.png" })
            .setThumbnail(`attachment://${thumbnailSucess.name}`);


        let channelTarget = interaction.options.getChannel('salon');
        if (!channelTarget) channelTarget = interaction.channel;
        const evtChoices = interaction.options.getString('choix');

        //////////////////////////////// MEMBRES ////////////////////////////////
        if (interaction.options.getSubcommand() === 'membres') {
            if (evtChoices == 'add') {
                db.query(`SELECT * FROM logs WHERE type = "members" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **enregistré** ${channelTarget} dans ma base de données ! **Les logs concernant les membres** s'afficheront là-bas désormais !`
                            }
                        )
                        let sql = `INSERT INTO logs (type, guildID, channelID) VALUES ('members', '${interaction.guild.id}', '${channelTarget.id}')`
                        db.query(sql, function (err) {
                            if (err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                    // Si le salon est déjà enregistré
                    else if (req[0].channelID === channelTarget.id) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je viens de me rappeler que ${channelTarget} est déjà enregistré dans la base de données pour **les logs concernant les membres** !`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si c'est un autre salon
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, j'ai fait la mise à jour !`,
                                value: `J'ai bien **enregistré** ${channelTarget} comme nouveau salon pour **les logs des membres** ! Ils s'afficheront là-bas désormais !`
                            }
                        )
                        db.query(`UPDATE logs SET channelID = '${channelTarget.id}' WHERE type = "members" AND guildID = ${interaction.guild.id}`)
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                })
            }
            else {
                db.query(`SELECT * FROM logs WHERE type = "members" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je peux t'affirmer qu'**aucun salon n'est enregistré** dans ma base de données pour **les logs des membres** ! De ce fait, impossible d'accéder à ta requête !`
                            }
                        )

                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si un salon est déjà enregistré
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **supprimé** le salon où **les logs des membres** s'affichaient de ma base de données ! Ils ne s'y afficheront plus !`
                            }
                        )
                        let sql = `DELETE FROM logs WHERE type = 'members' AND guildID = ${interaction.guild.id}`
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess]})
                    }
                })
            }
        }
        //////////////////////////////// MODÉRATION ////////////////////////////////
        else if (interaction.options.getSubcommand() === 'modération') {
            if (evtChoices == 'add') {
                db.query(`SELECT * FROM logs WHERE type = "modo" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **enregistré** ${channelTarget} dans ma base de données ! **Les logs concernant les actes de modération** s'afficheront là-bas désormais !`
                            }
                        )
                        let sql = `INSERT INTO logs (type, guildID, channelID) VALUES ('modo', '${interaction.guild.id}', '${channelTarget.id}')`
                        db.query(sql, function (err) {
                            if (err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                    // Si le salon est déjà enregistré
                    else if (req[0].channelID === channelTarget.id) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je viens de me rappeler que ${channelTarget} est déjà enregistré dans la base de données pour **les logs concernant les actes de modération** !`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si c'est un autre salon
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, j'ai fait la mise à jour !`,
                                value: `J'ai bien **enregistré** ${channelTarget} comme nouveau salon pour **les actes de modération** ! Ils s'afficheront là-bas désormais !`
                            }
                        )
                        db.query(`UPDATE logs SET channelID = '${channelTarget.id}' WHERE type = "modo" AND guildID = ${interaction.guild.id}`)
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                })
            }
            else {
                db.query(`SELECT * FROM logs WHERE type = "modo" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je peux t'affirmer qu'**aucun salon n'est enregistré** dans ma base de données pour **les logs des actes de modération** ! De ce fait, impossible d'accéder à ta requête !`
                            }
                        )

                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si un salon est déjà enregistré
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **supprimé** le salon où **les logs des actes de modération** s'affichaient de ma base de données ! Ils ne s'y afficheront plus !`
                            }
                        )
                        let sql = `DELETE FROM logs WHERE type = 'members' AND guildID = ${interaction.guild.id}`
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess]})
                    }
                })
            }
        }
        //////////////////////////////// MODÉRATION ////////////////////////////////
        else if (interaction.options.getSubcommand() === 'autres') {
            if (evtChoices == 'add') {
                db.query(`SELECT * FROM logs WHERE type = "other" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **enregistré** ${channelTarget} dans ma base de données ! **Les logs hors membres et modération** s'afficheront là-bas désormais !`
                            }
                        )
                        let sql = `INSERT INTO logs (type, guildID, channelID) VALUES ('other', '${interaction.guild.id}', '${channelTarget.id}')`
                        db.query(sql, function (err) {
                            if (err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                    // Si le salon est déjà enregistré
                    else if (req[0].channelID === channelTarget.id) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je viens de me rappeler que ${channelTarget} est déjà enregistré dans la base de données pour **les logs hors membres et modération** !`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si c'est un autre salon
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, j'ai fait la mise à jour !`,
                                value: `J'ai bien **enregistré** ${channelTarget} comme nouveau salon pour **les logs hors membres et modération** ! Ils s'afficheront là-bas désormais !`
                            }
                        )
                        db.query(`UPDATE logs SET channelID = '${channelTarget.id}' WHERE type = "other" AND guildID = ${interaction.guild.id}`)
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                })
            }
            else {
                db.query(`SELECT * FROM logs WHERE type = "other" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je peux t'affirmer qu'**aucun salon n'est enregistré** dans ma base de données pour **les logs hors membres et modération** ! De ce fait, impossible d'accéder à ta requête !`
                            }
                        )

                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si un salon est déjà enregistré
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **supprimé** le salon où **les logs hors membres et modération** s'affichaient de ma base de données ! Ils ne s'y afficheront plus !`
                            }
                        )
                        let sql = `DELETE FROM logs WHERE type = 'members' AND guildID = ${interaction.guild.id}`
                        db.query(sql, function(err) {
                            if(err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess]})
                    }
                })
            }
        }
    }
}