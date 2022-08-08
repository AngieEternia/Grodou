const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js')

module.exports = {
    name: 'setwelcome',
    category: "Configuration",
    permissions: ['MANAGE_GUILD'],
    ownerOnly: false,
    usage: 'setwelcome [add|remove] <channel>',
    examples: ['setwelcome add #nomDuSalon', 'setwelcome remove'],
    description: "J'enregistre dans ma mémoire l'endroit pour les images d'arrivée et de départ du serveur !",
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
            channelTypes: [0],
            required: false
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

        db.query(`SELECT * FROM setup WHERE type = "welcome" AND guildID = ${interaction.guild.id}`, async (err, req) => {
            if (evtChoices == 'add') {
                // S'il n'y a aucun salon enregistré
                if (req.length < 1) {
                    sucessEmbed.addFields(
                        {
                            name: `Ok mon pote, c'est tout bon !`,
                            value: `J'ai bien **enregistré** ${channelTarget} dans ma base de données ! **Les images pour l'arrivée et le départ** des membres s'afficheront là-bas désormais !`
                        }
                    )
                    let sql = `INSERT INTO setup (type, guildID, channelID, parentID) VALUES ('welcome', '${interaction.guild.id}', '${channelTarget.id}', '-')`
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
                            value: `Je viens de me rappeler que ${channelTarget} est déjà enregistré dans la base de données pour **afficher les images d'arrivée et de départ des membres** !`
                        }
                    )
                    await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                }
                // Si c'est un autre salon
                else {
                    sucessEmbed.addFields(
                        {
                            name: `Ok mon pote, j'ai fait la mise à jour !`,
                            value: `J'ai bien **enregistré** ${channelTarget} comme nouveau salon pour **afficher les images d'arrivée et de départ des membres** !`
                        }
                    )
                    db.query(`UPDATE setup SET channelID = '${channelTarget.id}' WHERE type = "welcome" AND guildID = ${interaction.guild.id}`)
                    await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
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
                            value: `Je peux t'affirmer qu'**aucun salon n'est enregistré** dans ma base de données pour **afficher les images d'arrivée et de départ des membres** ! De ce fait, impossible d'accéder à ta requête !`
                        }
                    )
                    await interaction.reply({ embeds: [errorEmbed], files: [thumbnail] })
                }
                // Si un salon est déjà enregistré
                else {
                    sucessEmbed.addFields(
                        {
                            name: `Ok mon pote, c'est tout bon !`,
                            value: `J'ai bien **supprimé** le salon où **les images d'arrivée et de départ des membres** s'affichaient de ma base de données !`
                        }
                    )
                    let sql = `DELETE FROM setup WHERE type = 'welcome' AND guildID = ${interaction.guild.id}`
                    db.query(sql, function (err) {
                        if (err) throw err;
                    })
                    await interaction.reply({ embeds: [sucessEmbed], files: [thumbnailSucess] })
                }
            }
        })
    }
}