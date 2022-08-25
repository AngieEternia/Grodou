const { EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'guildBanRemove',
    once: false,
    async execute(client, ban) {

        const db = client.db;
        db.query(`SELECT * FROM serveur WHERE guildID = ${ban.guild.id}`, async (err, req) => {

            const AuditsLogs = await ban.guild.fetchAuditLogs({
                type: 23,
                limit: 1
            })

            const LatestUnban = AuditsLogs.entries.first();
            const { executor, reason } = LatestUnban;

            let Embed = new EmbedBuilder()
                .setColor("#18ff00")
                .setAuthor({
                    name: `Utilisateur débanni`,
                    iconURL: "https://cdn.discordapp.com/emojis/1007206398100250705.png",
                })
                //.setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                .setDescription(`◽️ **Débanni :** ${ban.user.username} (id : \`${ban.user.id})\`\n◽️ **Auteur du débannissement :** ${executor})\n◽️ **Motif du débannissement :** \`\`\`${reason ? reason : "Aucun raison donnée"}\`\`\``)
                .setTimestamp();

            db.query(`SELECT * FROM logs WHERE type = 'modo' AND guildID = ${ban.guild.id}`, async (err, req2) => {
                if (req2.length < 1) return
                else await client.channels.cache.get(req2[0].channelID).send({ embeds: [Embed] })
            })
        })
    }
}