const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'setvoice',
    category: "Configuration",
    permissions: ['ManageGuild'],
    defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
    ownerOnly: false,
    usage: 'setvoice [add|remove] <channel>',
    examples: ['setvoice add #nomDuSalon', 'setvoice remove'],
    description: "J'enregistre dans ma mémoire l'endroit pour créer des canaux vocaux temporaires !",
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
            description: 'Le salon pour afficher les images d\'arrivée ou de départ',
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [2],
            required: true
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

        db.query(`SELECT * FROM setup WHERE type = "voice" AND guildID = ${interaction.guild.id} AND channelID = ${channelTarget.id}`, async (err, req) => {
            if (evtChoices == 'add') {
                // S'il n'y a aucun salon enregistré
                if (req.length < 1) {
                    sucessEmbed.addFields(
                        {
                            name: `Ok mon pote, c'est tout bon !`,
                            value: `J'ai bien **enregistré** ${channelTarget} dans ma base de données ! En cliquant dessus, **des canaux vocaux temporaires** pourront être créés dans la même catégorie par les membres !`
                        }
                    )
                    let sql = `INSERT INTO setup (type, guildID, channelID) VALUES ('voice', '${interaction.guild.id}', '${channelTarget.id}-${channelTarget.parentId}')`
                    db.query(sql, function(err) {
                        if(err) throw err;
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
                            value: `Je viens de me rappeler que ${channelTarget} est déjà enregistré dans la base de données pour créer **des canaux vocaux temporaires** !`
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
                            value: `Je peux t'affirmer qu'**aucun salon n'est enregistré** dans ma base de données pour créer **des canaux vocaux temporaires** ! De ce fait, impossible d'accéder à ta requête !`
                        }
                    )
                    await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                }
                // Si un salon est déjà enregistré
                else {
                    sucessEmbed.addFields(
                        {
                            name: `Ok mon pote, c'est tout bon !`,
                            value: `J'ai bien **supprimé** le salon de ma base de données ! Les membres ne pourront plus créer **des canaux vocaux temporaires** en cliquant dessus !`
                        }
                    )
                    let sql = `DELETE FROM setup WHERE type = 'voice' AND guildID = ${interaction.guild.id} AND channelID = '${channelTarget.id}-${channelTarget.parentId}'`
                    db.query(sql, function (err) {
                        if (err) throw err;
                    })
                    await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                }
            }
        })
    }
}