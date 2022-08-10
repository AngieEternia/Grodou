const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'softban',
    category: "Modération",
    permissions: ['BanMembers'],
    ownerOnly: false,
    usage: 'softban [@member] [duration] <raison>',
    examples: ['softban @Utilisateur 4', 'softban @Utilisateur 4 ceci_est_une_raison'],
    description: "Je punis les méchants avec un bannissement temporaire...!",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à bannir',
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: 'durée',
            description: 'La durée du bannissement en jour',
            type: ApplicationCommandOptionType.Number,
            minValue: 1,
            maxValue: 7,
            required: true
        },
        {
            name: 'raison',
            description: 'La raison du bannissement',
            type: ApplicationCommandOptionType.String,
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;
        const ID = await client.function.createID("TEMPBAN");
        const target = interaction.options.getMember('utilisateur');
        const duration = interaction.options.getNumber('durée');
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée";

        if (!target.bannable) return interaction.reply({ content: `❌ Non, non, non ! Cette personne a un totem d'immunité, elle ne peut pas être bannie, même temporairement... <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });

        target.ban({ days: duration, reason: `${reason} (Banni par ${interaction.user.tag})` });
        try {
            await target.send(`<:grodouNO:520329945168347157> ! Dis voir, coco, t'as été banni du serveur \`${interaction.guild.name}\` pendant \`${duration} jour${duration > 1 ? "s" : ""}\` pour la saison suivante : \`${reason}\` !`);
        } catch (err) { }
        await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été banni par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });

        let sql = `INSERT INTO bans (userID, authorID, banID, guildID, reason, date, time) VALUES(${target.id}, '${interaction.user.id}', '${ID}', '${interaction.guild.id}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}', '${duration * 86400000}')`;

        db.query(sql, function (err) {
            if (err) throw err;
        })
    }
}