const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    name: 'setevents',
    category: "Configuration",
    permissions: ['ManageGuild'],
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    ownerOnly: false,
    usage: 'setevents [configuration|probabilités|activation] [[add|remove]/[number]/[on|off]] <channel>',
    examples: ['setevents configuration add #nomDuSalon', 'setevents probabilités 50', 'setevents activation off'],
    description: "Configure-moi pour que je puisse dire librement des bêtises !",
    options: [
        {
            name: 'configuration',
            description: 'Ajouter ou supprimer des salons pour les events de Grodou',
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
                    description: 'Le salon pour afficher les bêtises de Grodou',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [0],
                    required: false
                }
            ]
        },
        {
            name: 'probabilités',
            description: 'Définir la probabilité pour que Grodou poste une bêtise',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'pourcentage',
                    description: `Choisir un nombre entre 0 et 100 (compris)`,
                    type: ApplicationCommandOptionType.Number,
                    minValue: 0,
                    maxValue: 100,
                    required: true,
                }
            ]
        },
        {
            name: 'activation',
            description: 'Activer ou désactiver les events de Grodou',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'choix',
                    description: `Activer ou Désactiver les bêtises de Grodou`,
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Activer',
                            value: 'on'
                        },
                        {
                            name: 'Désactiver',
                            value: 'off'
                        },
                    ]
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


        let channelTarget = interaction.options.getChannel('salon') || interaction.channel;
        const evtChoices = interaction.options.getString('choix');
        const purcent = interaction.options.getNumber('pourcentage');

        //////////////////////////////// CONDIFUGRATION /////////////////////////
        if (interaction.options.getSubcommand() === 'configuration') {
            db.query(`SELECT * FROM setup WHERE type = "troll" AND guildID = ${interaction.guild.id}`, async (err, req) => {
                if (evtChoices == 'add') {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **enregistré** ${channelTarget} dans ma base de données ! Je pourrais intervenir **à tout moment** là-bas désormais !`
                            }
                        )
                        let sql = `INSERT INTO setup (type, guildID, channelID, parentID) VALUES ('troll', '${interaction.guild.id}', '${channelTarget.id}', '-')`
                        db.query(sql, function (err) {
                            if (err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                    // Si le salon est déjà enregistré
                    else {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je viens de me rappeler que ${channelTarget} est déjà enregistré dans la base de données pour que **je dise des bêtises** !`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                }
                else {
                    // S'il n'y a aucun salon enregistré
                    if (req.length < 1) {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou2.png`, { name: `grodou.png` })
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`)
                        errorEmbed.addFields(
                            {
                                name: `Oups ! Houston, nous avons un problème !`,
                                value: `Je peux t'affirmer que ${channelTarget} n'est pas enregistré dans ma base de données pour que **je dise des** ! De ce fait, impossible d'accéder à ta requête !`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                    }
                    // Si un salon est déjà enregistré
                    else {
                        sucessEmbed.addFields(
                            {
                                name: `Ok mon pote, c'est tout bon !`,
                                value: `J'ai bien **supprimé** ${channelTarget} de ma base de données ! Je n'y ferai plus aucune intervention !`
                            }
                        )
                        let sql = `DELETE FROM setup WHERE type = 'troll' AND guildID = ${interaction.guild.id} AND channelID = ${channelTarget.id}`
                        db.query(sql, function (err) {
                            if (err) throw err;
                        })
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                    }
                }
            })
        }
        //////////////////////////////// POURCENTAGE ///////////////////////////
        if (interaction.options.getSubcommand() === 'probabilités') {
            db.query(`SELECT * FROM serveur WHERE guildID = ${interaction.guild.id}`, async (err, req) => {
                // Ajout pour l'embed
                sucessEmbed.addFields(
                    {
                        name: `Ok mon pote, c'est tout bon !`,
                        value: `Il y a maintenant ${purcent}% de chance que je parle n'importe quand... <:grodouAH:520329433752797184>`
                    }
                );
                // On met à jour la ligne correspondante dans la base de données
                db.query(`UPDATE serveur SET purcent_troll = ${purcent} WHERE guildID = ${interaction.guild.id}`);

                // Et on envoie...!
                await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] });
            });
        }
        //////////////////////////////// ACTIVATION ////////////////////////////
        if (interaction.options.getSubcommand() === 'activation') {
            db.query(`SELECT * FROM serveur WHERE guildID = ${interaction.guild.id}`, async (err, req) => {
                if (evtChoices == 'on') {
                    // Si le salon n'est pas enregistré alors on l'enregistre
                    if (req[0].troll === "off") {
                        thumbnailSucess = new AttachmentBuilder(`./Img/emotes/grodou3.png`, { name: `grodou.png` });
                        sucessEmbed.addFields(
                            {
                                name: `Oh, salut ${interaction.user} !`,
                                value: `Merci de m'avoir réveillé ! Je m'en vais dire plein de bêtises maintenant ! Quand ? Eh bien, ça, c'est un secret...!`
                            }
                        )
                        db.query(`UPDATE serveur SET troll = 'on' WHERE guildID = ${interaction.guild.id}`);
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] });
                    }
                    // Si le salon est déjà enregistré
                    else {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou10.png`, { name: `grodou.png` });
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`);
                        errorEmbed.addFields(
                            {
                                name: `Eh, oh, ${interaction.displayName}, va falloir se calmer !`,
                                value: `Au cas où tu ne le saurais pas, j'ai déjà bu trois cafés, je suis réveilé depuis un p'tit moment déjà !`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] });
                    }

                }
                else if (evtChoices == 'off') {
                    // Si le salon n'est pas enregistré alors on l'enregistre
                    if (req[0].troll === "on") {
                        thumbnailSucess = new AttachmentBuilder(`./Img/emotes/grodou8.png`, { name: `grodou.png` });
                        sucessEmbed.addFields(
                            {
                                name: `Bon, bah, d'accord ${interaction.displayName}...`,
                                value: `J'ai compris le message... J'arrête de dire des bêtises, je vais me coucher... <:grodou9:903378318039068786>`
                            }
                        )
                        db.query(`UPDATE serveur SET troll = 'off' WHERE guildID = ${interaction.guild.id}`);
                        await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] });
                    }
                    // Si le salon est déjà enregistré
                    else {
                        let thumbnail = new AttachmentBuilder(`./Img/emotes/grodou11.png`, { name: `grodou.png` });
                        errorEmbed.setThumbnail(`attachment://${thumbnail.name}`);
                        errorEmbed.addFields(
                            {
                                name: `💤💤💤💤💤💤💤💤💤`,
                                value: `(Je suis déjà en train de dormir profondément, si tu n'avais pas remarqué...)`
                            }
                        )
                        await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] });
                    }
                }
            })
        }
    }
}