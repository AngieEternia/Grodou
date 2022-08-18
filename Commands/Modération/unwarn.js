const { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } = require('discord.js')

module.exports = {
    name: 'unwarn',
    category: "Modération",
    permissions: ['ModerateMembers'],
    defaultMemberPermissions: PermissionFlagsBits.ModerateMembers,
    ownerOnly: false,
    usage: 'unwarn [@member] <raison>',
    examples: ['unwarn @Utilisateur', 'unwarn @Utilisateur ceci_est_une_raison'],
    description: "J'enlève un carton jaune aux petits démons qui se sont mieux comportés",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à qui retirer un avertissement',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'raison',
            description: 'La raison de la  suppression de l\'avertissement',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;

        const ID = await client.function.createID("WARN");

        const target = interaction.options.getMember('utilisateur');
        let reason = interaction.options.getString('raison') || "Aucune raison donnée";

        if (!target.moderatable) return interaction.reply({ content: `❌ Non, non, non ! Cette personne a un totem d'immunité, elle ne peut pas avoir un avertissement retiré... <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });

        db.query(`SELECT * FROM warns WHERE guildID = '${interaction.guild.id}' AND userID = ${target.id}`, async (err, req) => {
            if (req.length < 1) {
                return interaction.reply({
                    content: `Je suis désolé mais ${target} n'a \`aucun avertissiement\` ! Impossible d'accéder à ta requête !`,
                    ephemeral: true,
                    fetchReply: true
                });
            }
            else if (req.length == 1) {
                db.query(`SELECT * FROM serveur WHERE guildID = '${interaction.guild.id}'`, async (err, req) => {
                    if (req.length < 1) return;
                    if (target.roles.cache.find(r => r.id === req[0].warn_role)) {
                        await target.roles.remove(req[0].warn_role, ['Avertissement retiré']);
                    }
                })
                let sql = `DELETE FROM warns WHERE userID = ${target.id} AND guildID = ${interaction.guild.id} ORDER BY date DESC LIMIT 1`
                await db.query(sql, function (err) {
                    if (err) throw err;
                    interaction.reply({
                        content: `⚠️ **\`${interaction.user.tag}\` a supprimé l'avertissement de \`${target.displayName}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`,
                        fetchReply: true
                    })
                })
            }
            else {
                let sql = `DELETE FROM warns WHERE userID = ${target.id} AND guildID = ${interaction.guild.id} ORDER BY date DESC LIMIT 1`
                await db.query(sql, function (err) {
                    if (err) throw err;
                    interaction.reply({
                        content: `⚠️ **\`${interaction.user.tag}\` a supprimé un avertissement de \`${target.displayName}\` avec succès <:grodouAH:520329433752797184> (${req.length - 1} restant${req.length - 1 > 1 ? "s" : ""}) !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`,
                        fetchReply: true
                    })
                })
            }
        })

        // Envoie du logs
        let Embed = new EmbedBuilder()
            .setColor("#ff8a00")
            .setAuthor({
                name: `Avertissement retiré`,
                iconURL: "https://cdn.discordapp.com/emojis/1007206397152350229.png",
            })
            //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`◽️ **Utilisateur concerné :** ${target} (id : \`${target.id}\`)\n◽️ **Auteur de la suppression :** ${interaction.user}\n◽️ **Motif de la suppression :** \`\`\`${reason}\`\`\``)
            .setTimestamp();

        db.query(`SELECT * FROM logs WHERE type = 'modo' AND guildID = ${interaction.guild.id}`, async (err, req) => {
            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [Embed] });
            }
        })
    }
}