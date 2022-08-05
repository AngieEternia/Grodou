const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'kick',
    category: "Modération",
    permissions: ['KICK_MEMBERS'],
    ownerOnly: false,
    usage: 'kick [@member] <raison>',
    examples: ['kick @Utilisateur', 'kick @Utilisateur ceci_est_une_raison'],
    description: "Je montre la porte de sortie aux gros relous en les kickant bien comme il faut !",
    options: [
        {
            name: 'utilisateur',
            description: 'Le membre à expulser',
            type: 'USER',
            required: true
        },
        {
            name: 'raison',
            description: 'La raison de l\'expulsion',
            type: 'STRING',
            required: false
        }
    ],
    async runInteraction(client, interaction) {

        const db = client.db;

        const ID = await client.function.createID("KICK");

        const target = interaction.options.getMember('utilisateur');
        let reason = interaction.options.getString('raison');
        if (!reason) reason = "Aucune raison donnée";

        if (!target.kickable) return interaction.reply({ content: `❌ Non, non, non ! Cette personne a un totem d'immunité, elle ne peut pas être expulsée... <:grodou2:903378318668222575>`, ephemeral: true, fetchReply: true });

        target.kick(`${reason} (Expulsé par ${interaction.user.tag})`);
        try {
            await target.send(`<:grodouNO:520329945168347157> ! Bah alors coco, t'as été expulsé du serveur \`${interaction.guild.name}\` pour la saison suivante : \`${reason}\` !`);
        } catch (err) { }
        await interaction.reply({ content: `**🚫 \`${target.displayName}\` a été expulsé par \`${interaction.user.tag}\` avec succès <:grodouAH:520329433752797184> !\n🪧 Raison : 🙶 \`${reason}\` 🙸**`, fetchReply: true });

        let sql = `INSERT INTO kicks (userID, authorID, kickID, guildID, reason, date) VALUES(${target.id}, '${interaction.user.id}', '${ID}', '${interaction.guild.id}', '${reason.replace(/'/g, "\\'")}', '${Date.now()}')`;

        db.query(sql, function (err) {
            if (err) throw err;
        })

        let Embed = new MessageEmbed()
            .setColor("#d05c5c")
            .setAuthor({
                name: `Utilisateur expulsé`,
                iconURL: "https://cdn.discordapp.com/emojis/979738900585148437.png",
            })
            //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`◽️ Expulsé :** ${target} (id : \`${target.id}\`)\n◽️ **Auteur de l'expulsion :** ${interaction.user}\n◽️ **Motif de l'expulsion :** \`\`\`${reason}\`\`\``)
            .setTimestamp();

        db.query(`SELECT * FROM config WHERE type = 'logs' AND guildID = ${interaction.guild.id}`, async (err, req) => {

            if (req.length < 1) return;
            else {
                const logChannel = client.channels.cache.get(req[0].channelID);
                logChannel.send({ embeds: [Embed] });
            }
        })
    }
}