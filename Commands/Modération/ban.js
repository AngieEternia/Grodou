const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'ban',
    category: "Modération",
    permissions: ['BAN_MEMBERS'],
    ownerOnly: false,
    usage: 'ban [@member] <raison>',
    examples: ['ban @Utilisateur', 'ban @Utilisateur ceci_est_une_raison'],
    description: "Je punis les méchants en les faisant s'envoler vers d'autres cieux avec un bannissement !",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à bannir',
            type: 'USER',
            required: true
        },
        {
            name: 'raison',
            description: 'La raison du bannissement',
            type: 'STRING',
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;
        const ID = await client.function.createID("BAN");
        const target = interaction.options.getMember('utilisateur');
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée";

        if (!target.bannable) return interaction.reply({ content: `❌ Non, non, non ! Cette personne a un totem d'immunité, elle ne peut pas être bannie... <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });

        target.ban({ reason: `${reason} (Banni par ${interaction.user.tag})` });
        try {
            await target.send(`<:grodouNO:520329945168347157> ! Dis voir, coco, t'as été banni du serveur \`${interaction.guild.name}\` pour la saison suivante : \`${reason}\` !`);
        } catch (err) { }
        await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été banni par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });

        let sql = `INSERT INTO bans (userID, authorID, banID, guildID, reason, date, time) VALUES(${target.id}, '${interaction.user.id}', '${ID}', '${interaction.guild.id}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}', 'Définitif')`;

        db.query(sql, function (err) {
            if (err) throw err;
        })
    }
}