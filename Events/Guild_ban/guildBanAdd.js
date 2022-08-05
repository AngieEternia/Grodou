const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'guildBanAdd',
    once: false,
    async execute(client, ban) {

        const db = client.db;
        db.query(`SELECT * FROM serveur WHERE guildID = ${ban.guild.id}`, async (err, req) => {

            const AuditsLogs = await ban.guild.fetchAuditLogs({
                type: 'MEMBER_BAN_ADD',
                limit: 1
            })

            const LatestBan = AuditsLogs.entries.first();
            const { executor, target, reason } = LatestBan;

            let Embed = new MessageEmbed()
                .setColor("#ff0000")
                .setAuthor({
                    name: `Utilisateur banni`,
                    iconURL: "https://cdn.discordapp.com/emojis/979738900534820944.png",
                })
                //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`◽️ **Banni :** ${ban.user} (id : \`${ban.user.id})\`\n◽️ **Auteur du bannissement :** ${executor})\n◽️ **Motif du bannissement :** \`\`\`${reason ? reason : "Aucun raison donnée"}\`\`\``)
                .setTimestamp();

            db.query(`SELECT * FROM config WHERE type = 'logs' AND guildID = ${ban.guild.id}`, async (err, req2) => {
                if (req2.length < 1) return
                else await client.channels.cache.get(req2[0].channelID).send({ embeds: [Embed] })
            })
        })
    }
}